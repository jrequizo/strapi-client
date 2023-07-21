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
        models: [...TModels],
    }) {
        // Initialize the client
        this.client = axios.create({
            baseURL: params.baseURL
        });

        const api = params.models.reduce((accumulatedModels, v) => {
            const current = v as any;
            // Transform the routes to their base functions

            const routes = Object.keys(current.routes).reduce((accumulatedRoutes, currentRouteKey) => {
                return {
                    // Provide the client to each of the intermediate functions
                    [currentRouteKey]: current.routes[currentRouteKey](this.client),
                    ...accumulatedRoutes
                }
            }, {});

            return {
                ...accumulatedModels,
                [current.endpoint]: routes
            }
        }, {});

        this.api = api as any;

        // this.models = params.models;

        // Transform the models into their respective endpoints

    }


}

export default StrapiClient;