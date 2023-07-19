import { z, ZodSchema } from "zod";

import { createDefaultMethods } from "./createDefaultMethods";
import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig } from "axios";

import { AnyRouterRecord, CustomRouteParam, RouterRecord, StrapiModelSchema } from "../types/model";


class StrapiModel<
    PropertyType,
    InputZodSchema extends StrapiModelSchema<PropertyType>,
    Schema extends { [key: string]: unknown } = {
        [K in keyof InputZodSchema]: z.infer<InputZodSchema[K]>
    }
> {
    /**
     * The url of the Collection to target.
     */
    endpoint: string;

    /**
     * The properties of the Collection
     */
    schema: { [x: string]: ZodSchema };

    /**
     * The bound routes to this collection and their corresponding client implementations.
     */
    routes: AnyRouterRecord = {};

    /**
     * Check to avoid duplication of default routes
     * @internal
     */
    _hasDefaultRoutes = false;

    constructor(endpoint: string, schema: InputZodSchema) {
        this.endpoint = endpoint;
        this.schema = schema;
    }

    /**
     * Create the default CRUD bindings present in Strapi for this model.
     * @returns `this` The current StrapiModel instance.
     */
    createDefaultRoutes() {
        if (!this._hasDefaultRoutes) {
            const defaultRoutes = createDefaultMethods<Schema>(this.endpoint);

            const newRoutes = {
                create: defaultRoutes.createBase,
                find: defaultRoutes.findBase,
                findOne: defaultRoutes.findOneBase,
                update: defaultRoutes.updateBase,
                delete: defaultRoutes.deleteBase,
                ...this.routes,
            };

            this.routes = newRoutes;

            this._hasDefaultRoutes = true;
        }

        return this;
    }


    /**
     * Creates a custom route handler for the specified endpoint
     * @returns 
     */
    createCustomRoute<
        TInput,
        TOutputSchema,
        TOutput extends TOutputSchema,
        RouteParams extends CustomRouteParam<TInput, TOutputSchema, TOutput>,
    >(path: string, params: RouteParams) {
        const newCustomRoutes: AnyRouterRecord = {}

        if (!Object.keys(this.routes).find(key => key === path)) {
            newCustomRoutes[path] = (client: AxiosInstance) => {
                // Return the executable function
                return async function callable(input: TInput) {
                    const result = await params.handler({
                        input,
                        // Fill the endpoint field with the provided endpoint
                        get: (config) => client.get(path, config),
                        put: (data, config) => client.put(path, data, config),
                        post: (data, config) => client.post(path, data, config),
                        patch: (data, config) => client.patch(path, data, config),
                        delete: (config) => client.delete(path, config),
                        client,
                    });

                    if (params.response) {
                        const isValidResult = params.response.safeParse(result);

                        if (!isValidResult.success) {
                            // TODO: proper validation error?
                            throw Error("Validation Error");
                        }
                    }

                    return result as TOutput;
                }
            }

            // const routes: RouterRecord = {
            //     [params.path]: (client: AxiosInstance) => {
            //         // Return the executable function
            //         return async function callable(input: TInput) {
            //             const result = await params.handler({
            //                 input,
            //                 // Fill the endpoint field with the provided endpoint
            //                 get: (config) => client.get(params.path, config),
            //                 put: (data, config) => client.put(params.path, data, config),
            //                 post: (data, config) => client.post(params.path, data, config),
            //                 patch: (data, config) => client.patch(params.path, data, config),
            //                 delete: (config) => client.delete(params.path, config),
            //                 client,
            //             });

            //             if (params.response) {
            //                 const isValidResult = params.response.safeParse(result);

            //                 if (!isValidResult.success) {
            //                     // TODO: proper validation error?
            //                     throw Error("Validation Error");
            //                 }
            //             }

            //             return result as TOutput;
            //         }
            //     },

            //     ...this.routes
            // }
        }

        this.routes = {
            ...newCustomRoutes,
            ...this.routes
        };

        return newCustomRoutes;
    }

    /**
     * @internal
     */
    _addToRoute(route: any) {

    }

}

export default StrapiModel;