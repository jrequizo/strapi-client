import { AxiosInstance } from "axios";

import { parseOutput } from "../util/parseOutput";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function update<TOutput>(client: AxiosInstance, routerPath: string, params: any) {
    const path = encodeURIComponent(`${routerPath}`);

    const url = new URL(`${client.defaults.baseURL}/${path}/${params.id}`);

    const response = await client.put(url.toString(), { data: params.update });

    if (response.status !== 200) {
        return response;
    }

    const result = parseOutput(response.data.data);
    return result as TOutput;
}