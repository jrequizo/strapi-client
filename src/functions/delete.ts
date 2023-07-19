import { AxiosInstance } from "axios";

import { parseOutput } from "../util/parseOutput";

import { DeleteType } from "../types/types";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function remove<TOutput>(client: AxiosInstance, routerPath: string, params: DeleteType) {
    const path = encodeURIComponent(`${routerPath}`);

    const url = new URL(`${client.defaults.baseURL}/${path}/${params.id}`);

    const response = await client.delete(url.toString());

    if (response.status !== 200) {
        return response;
    }

    const result = parseOutput(response.data.data);
    return result as TOutput;
}