import axios, { AxiosInstance } from "axios";

import { AnyStrapiModel, StrapiModelMap, TransformPathToKey, UnionToIntersection } from "../types/model";

class StrapiClient<
    TModels extends AnyStrapiModel[],
    API extends UnionToIntersection<TransformPathToKey<[...TModels][number]>>
> {
    client: AxiosInstance;
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

    }


}

export default StrapiClient;