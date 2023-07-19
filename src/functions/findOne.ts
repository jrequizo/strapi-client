import { AxiosInstance } from "axios";
;
import { findCore } from "./findCore";

import { parseOutput } from "../util/parseOutput";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function findOne<TInput, TOutput>(client: AxiosInstance, routerPath: string, params: TInput) {
    const response = await findCore(client, routerPath, params);

    if (response.status !== 200) {
        return response;
    }
    
    const result = parseOutput(response.data.data);
    return result as TOutput[];
}