import { AxiosInstance } from "axios";

import { transformToString } from "../util/transform";


/**
 * 
 * @param client 
 * @param routerPath 
 * @param params 
 * @returns 
 */
export async function findCore(client: AxiosInstance, routerPath: string, params: any) {
    if (!params) {
        params = {};
    }

    const publicationState = params.publicationState ?? "preview"

    const path = encodeURIComponent(`${routerPath}`);

    const url = new URL(`${client.defaults.baseURL}/${path}`);

    url.searchParams.set("publicationState", publicationState);

    // TODO: populate

    // if (params.populate) {
    //     if (params.populate === "*") {
    //         url.searchParams.set("populate", "*");
    //     } else {
    //         const _data = params.populate as any;
    //         Object.keys(_data).forEach((key) => {
    //             url.searchParams.set(`populate[0]`, _data[key]);
    //         })
    //     }
    // }

    // Temporary populate fill
    if (params.populate) {
        url.searchParams.set('populate', '*');
    }

    // Transform the filter conditions into the strapi searchParams schema
    if (params.filters) {
        const _filters = transformToString(params.filters) as any;

        function iterate(filter: string, object: { [key: string]: any }) {
            Object.keys(object).forEach((key) => {
                if (object[key] instanceof Object) {
                    iterate(`${filter}[${key}]`, object[key]);
                } else {
                    url.searchParams.set(`${filter}[${key}]`, object[key]);
                }
            });
        }

        Object.keys(_filters).forEach((key) => {
            iterate(`filters[${key}]`, _filters[key])
        });
    }

    const response = await client.get(url.toString());

    return response;
}