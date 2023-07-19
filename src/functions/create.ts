import { AxiosInstance } from "axios";

import { transformToString } from "../util/transform";
import { parseOutput } from "../util/parseOutput";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function create<TInput, TOutput>(client: AxiosInstance, routerPath: string, params?: TInput) {
    const path = encodeURIComponent(`${routerPath}`);

    const url = new URL(`${client.defaults.baseURL}/${path}`);

    const data = transformToString(params as any);

    const response = await client.post(url.toString(), { data });

    if (response.status !== 200) {
        return response;
    }

    const result = parseOutput(response.data.data);
    return result as TOutput;
}