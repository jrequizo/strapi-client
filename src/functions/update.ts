import { AxiosInstance } from "axios";

import { parseOutput } from "../util/parseOutput";

import { UpdateType } from "../types/crud";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function update<TUpdateSchema, TInput extends UpdateType<TUpdateSchema>, TOutput>(client: AxiosInstance, routerPath: string, params: TInput) {
    const path = encodeURIComponent(`${routerPath}`);

    const url = new URL(`${client.defaults.baseURL}/${path}/${params.id}`);

    const response = await client.put(url.toString(), { data: params.update });

    if (response.status !== 200) {
        return response;
    }

    const result = parseOutput(response.data.data);
    return result as TOutput;
}