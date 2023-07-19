import axios, { AxiosInstance } from "axios";

import StrapiModel from "./StrapiModel";

class StrapiClient {
    client: AxiosInstance;

    constructor(params: {
        baseURL: string,
        models: StrapiModel[],    // TODO
    }) {
        // Initialize the client
        this.client = axios.create({
            baseURL: params.baseURL
        });

        // Transform the models into their respective endpoints
    }


}

export default StrapiClient;