import { QuestionDisplayModel } from "@/classes/QuestionAnswerModel";
import { QuestionGridModel } from "@/classes/QuestionGrid";
import { Deserialize, DeserializeArray } from "@/helpers/JsonMapper";
import axios, { type AxiosResponse } from "axios";

const BASE_URL = "/api";
axios.defaults.baseURL = 'https://localhost:7155';  

class _stackoverflowService {

    public async GetGrid(): Promise<QuestionGridModel[]>{
        const response: AxiosResponse<JsonMapper.IGenericObject[]> = await axios.get<JsonMapper.IGenericObject[]>(`${BASE_URL}/GetQuestions`);
        return DeserializeArray(QuestionGridModel, response.data);
    }

    public async GetQuestion(id: number): Promise<QuestionDisplayModel>{
        const response: AxiosResponse<JsonMapper.IGenericObject[]> = await axios.get<JsonMapper.IGenericObject[]>(`${BASE_URL}/GetQuestion/${id}`);
        return Deserialize(QuestionDisplayModel, response.data);
    }

}

export const StackOverflowService: _stackoverflowService = new _stackoverflowService();