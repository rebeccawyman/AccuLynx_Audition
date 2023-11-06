/* eslint-disable @typescript-eslint/no-use-before-define */
/*
 *  This is forked from https://github.com/jf3096/json-typescript-mapper
 *  The project has not been getting updates but works 90% of the way
 *  There are custom modifications to this source
 *  Notably, added nullable deserialization and allow deserialization of arrays
 */
import "reflect-metadata";


const JSON_META_DATA_KEY = "JsonProperty";


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function IsTargetType(val: any, type: "object" | "string"): boolean {
    return typeof val === type;
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function IsPrimitiveOrPrimitiveClass(obj: any): boolean {
    return !!(
        ["string", "boolean", "number"].indexOf(typeof obj) > -1 ||
        obj instanceof String ||
        obj === String ||
        obj instanceof Number ||
        obj === Number ||
        obj instanceof Boolean ||
        obj === Boolean
    );
}


// eslint-disable-next-line @typescript-eslint/ban-types
export function IsArrayOrArrayClass(clazz: Function): boolean {
    if (clazz === Array) {
        return true;
    }


    return Object.prototype.toString.call(clazz) === "[object Array]";
}


class DecoratorMetaData<T> implements JsonMapper.IDecoratorMetaData<T> {
    constructor(public Name?: string, public Clazz?: { new(): T }) { }
}


export function JsonProperty<T>(metadata?: JsonMapper.IDecoratorMetaData<T> | string): (target: Record<string, any>, targetKey: string | symbol) => void {
    let decoratorMetaData: JsonMapper.IDecoratorMetaData<T>;


    if (IsTargetType(metadata, "string")) {
        decoratorMetaData = new DecoratorMetaData<T>(metadata as string);
    } else if (IsTargetType(metadata, "object")) {
        decoratorMetaData = metadata as JsonMapper.IDecoratorMetaData<T>;
    } else {
        throw new Error(`index.ts: meta data in Json property is undefined. meta data: ${metadata}`);
    }


    return Reflect.metadata(JSON_META_DATA_KEY, decoratorMetaData);
}


function GetClazz<T>(target: T, propertyKey: string): { new(): T } {
    return Reflect.getMetadata("design:type", target, propertyKey);
}


export function GetJsonProperty<T>(target: T, propertyKey: string): JsonMapper.IDecoratorMetaData<T> {
    return Reflect.getMetadata(JSON_META_DATA_KEY, target, propertyKey) as JsonMapper.IDecoratorMetaData<T>;
}


function HasAnyNullOrUndefined(...args: any[]): boolean {
    return args.some((arg: any) => arg === null || arg === undefined);
}


function MapFromJson<T>(decoratorMetadata: JsonMapper.IDecoratorMetaData<T>, instance: T, json: JsonMapper.IGenericObject, key: string): any {
    //if decorator name is not found, use target property key as decorator name. It means mapping it directly
    const decoratorName: string = decoratorMetadata.Name || key;
    const innerJson: any = json ? json[decoratorName] : undefined;


    if (!IsPrimitiveOrPrimitiveClass(innerJson)) {
        // need to default to the decorated class so we can use nullable classes
        //the way this is, we wouldnt be able to do nullable arrays
        const metadata: JsonMapper.IDecoratorMetaData<T> = GetJsonProperty(instance, key);


        //is there actually an issue with nullable here?
        const relfectedTypeClazz = GetClazz(instance, key);
        const clazz = metadata && metadata.Clazz ? metadata.Clazz : relfectedTypeClazz;


        // added this undefined check because something changed in TS that changed how metadata gets resolved
        // not sure if there are any side effects yet
        if (clazz !== undefined) {
            if (IsArrayOrArrayClass(relfectedTypeClazz)) {
                if ((metadata && metadata.Clazz) || IsPrimitiveOrPrimitiveClass(clazz)) {
                    if (innerJson && IsArrayOrArrayClass(innerJson) && metadata.Clazz !== undefined) {
                        const clazz = metadata.Clazz;
                        return innerJson.map((item: any) => NullableDeserialize(clazz, item));
                    }


                    return undefined;
                } else {
                    return innerJson;
                }
            }


            if (!IsPrimitiveOrPrimitiveClass(clazz)) {
                return NullableDeserialize(clazz, innerJson);
            }
        }
    }
    return innerJson;
}


function NullableDeserialize<T extends JsonMapper.IGenericObject>(clazz: { new(): T }, json: JsonMapper.IGenericObject): T | null {
    if (HasAnyNullOrUndefined(clazz, json)) {
        return null;
    }


    if (!IsTargetType(json, "object")) {
        return null;
    }


    return InternalDeserialize(clazz, json);
}


export function Deserialize<T extends JsonMapper.IGenericObject>(clazz: { new(): T }, json: JsonMapper.IGenericObject): T {
    if (HasAnyNullOrUndefined(clazz, json)) {
        throw new Error("Deserialize => null or undefined value");
    }


    if (!IsTargetType(json, "object")) {
        throw new Error("Deserialize => invalid json");
    }


    return InternalDeserialize(clazz, json);
}


function InternalDeserialize<T extends Record<string, any>>(clazz: { new(): T }, json: JsonMapper.IGenericObject): T {
    const instance: T = new clazz();
    Object.keys(instance).forEach((key: keyof T) => {
        const decoratorMetaData: JsonMapper.IDecoratorMetaData<Record<string, unknown>> = GetJsonProperty(instance, key as string);


        if (decoratorMetaData) {
            if (decoratorMetaData.CustomConverter) {
                instance[key] = decoratorMetaData.CustomConverter.FromJson(json[decoratorMetaData.Name || (key as string)]) as T[keyof T];
            } else if (decoratorMetaData.ExcludeFromJson !== true) {
                instance[key] = MapFromJson(decoratorMetaData, instance, json, key as string);
                // } else {
                //     instance[key] = json[key as string];
            }
        } else {
            instance[key] = json[key as string];
        }
    });


    return instance;
}


export function DeserializeArray<T extends JsonMapper.IGenericObject>(clazz: { new(): T }, json: JsonMapper.IGenericObject[]): T[] {
    const arr: T[] = [];
    for (let i = 0; i < json.length; i++) {
        const item: T | null = NullableDeserialize(clazz, json[i]);
        if (item !== null) {
            arr.push(item);
        }
    }


    return arr;
}


// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function Serialize(instance: any): any {
    if (!IsTargetType(instance, "object") || IsArrayOrArrayClass(instance)) {
        return instance;
    }


    if (instance === null) {
        return null;
    }


    const obj: any = {};


    Object.keys(instance).forEach((key) => {
        const metadata: JsonMapper.IDecoratorMetaData<Record<string, any>> = GetJsonProperty(instance, key);
        if (metadata) {
            obj[metadata.Name ? metadata.Name : key] = SerializeProperty(metadata, instance[key]);
        } else {
            obj[key] = instance[key];
        }
    });


    //getters and inheritied properties are down on the proto
    const proto = Object.getPrototypeOf(instance);
    Object.getOwnPropertyNames(proto)
        .filter((x) => proto.hasOwnProperty(x) && x !== "constructor" && x !== "__ob__")
        .forEach((key) => {
            const metadata: JsonMapper.IDecoratorMetaData<Record<string, any>> = GetJsonProperty(instance, key);
            if (metadata) {
                obj[metadata.Name ? metadata.Name : key] = SerializeProperty(metadata, instance[key]);
            } else {
                obj[key] = instance[key];
            }
        });


    return obj;
}


function SerializeProperty(metadata: JsonMapper.IDecoratorMetaData<any>, prop: any): any {
    if (metadata) {
        if (metadata.ExcludeToJson) {
            return undefined;
        }


        if (metadata.CustomConverter) {
            return metadata.CustomConverter.ToJson(prop);
        }


        if (!metadata.Clazz) {
            return prop;
        }


        if (IsArrayOrArrayClass(prop)) {
            return prop.map((propItem: any) => Serialize(propItem));
        }


        return Serialize(prop);
    } else {
        return undefined;
    }
}
