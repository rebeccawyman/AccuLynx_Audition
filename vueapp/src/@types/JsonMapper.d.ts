declare namespace JsonMapper {
    interface IGenericObject {
        [key: string]: any;
    }


    interface ICustomConverter<T> {
        FromJson(data: string): T;
        ToJson(data: T): Nullable<string>;
    }


    interface IDecoratorMetaData<T> {
        Clazz?: { new(): T };
        CustomConverter?: ICustomConverter<T>;
        ExcludeFromJson?: boolean;
        ExcludeToJson?: boolean;
        Name?: string;
    }
}
