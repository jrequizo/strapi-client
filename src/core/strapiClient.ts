import axios, { AxiosInstance } from "axios";

import { AnyStrapiModel, StrapiModelMap } from "../types/model";

class StrapiClient<
    TModels extends AnyStrapiModel[],
    API extends StrapiModelMap<TModels>
> {
    client: AxiosInstance;

    // models: [...TModels];
    api: API;

    constructor(params: {
        baseURL: string,
        models: [...TModels],    // TODO
    }) {
        // Initialize the client
        this.client = axios.create({
            baseURL: params.baseURL
        });

        const api = params.models.reduce((previous, v,) => {
            const current = v as any;
            return {
                ...previous,
                [current.endpoint]: current.routes
            }
        }, {});

        this.api = api as any;

        console.log(api);

        // this.models = params.models;

        // Transform the models into their respective endpoints

    }


}

export default StrapiClient;