import { z, ZodOptional, ZodSchema } from "zod";

import { createDefaultMethods } from "./createDefaultMethods";
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import { AnyModelRecord, ModelWrapperFunction, StrapiModelSchema } from "../types/model";
import { CreateType, UpdateType, DeleteType, FindType } from "../types/crud";


/**
 * Defines the properties required for creating a custom rout in a `StrapiModel`.
 * @internal
 */
type CustomRouteParam<TInput, TOutputSchema, TOutput extends TOutputSchema, TZodSchema = ZodSchema<TInput>> = {
    params?: TZodSchema,
    response?: ZodSchema<TOutputSchema>
    handler: (props: {
        client: AxiosInstance,
        input: TInput,
        // Prune the Http CRUD requests of the `url` parameter
        get: <T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>) => Promise<R>,
        put: <T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>) => Promise<R>,
        post: <T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>) => Promise<R>,
        patch: <T = any, R = AxiosResponse<T>, D = any>(data?: D, config?: AxiosRequestConfig<D>) => Promise<R>,
        delete: <T = any, R = AxiosResponse<T>, D = any>(config?: AxiosRequestConfig<D>) => Promise<R>,
    }) => Promise<TOutput>,
}


class StrapiModel<
    TEndpoint,
    InputZodSchema extends StrapiModelSchema<any>,
    ThisRouterRecord extends AnyModelRecord,
    Schema extends { [key: string]: unknown } = {
        [K in keyof InputZodSchema]: z.infer<InputZodSchema[K]>
    },
> {
    /**
     * The url of the Collection to target.
     */
    endpoint: string & keyof TEndpoint;

    /**
     * The properties of the Collection
     */
    schema: { [x: string]: ZodSchema };

    /**
     * The bound routes to this collection and their corresponding client implementations.
     */
    routes: ThisRouterRecord;

    /**
     * Check to avoid duplication of default routes
     * @internal
     */
    _hasDefaultRoutes = false;

    constructor(endpoint: string & keyof TEndpoint, schema: InputZodSchema) {
        this.endpoint = endpoint;
        this.schema = schema;
        this.routes = {} as ThisRouterRecord;
    }

    /**
     * Create the default CRUD bindings present in Strapi for this model.
     * @returns `this` The current StrapiModel instance.
     */
    createDefaultRoutes(): StrapiModel<
        TEndpoint,
        InputZodSchema,
        ThisRouterRecord & {
            create: (client: AxiosInstance) => (params?: CreateType<Schema>) => Promise<Schema | AxiosResponse<any, any>>,
            find: (client: AxiosInstance) => (params?: FindType<Schema>) => Promise<AxiosResponse<any, any> | Schema[]>,
            findOne: (client: AxiosInstance) => (params?: FindType<Schema>) => Promise<AxiosResponse<any, any> | Schema[]>,
            update: (client: AxiosInstance) => (params: UpdateType<Schema>) => Promise<Schema | AxiosResponse<any, any>>,
            delete: (client: AxiosInstance) => (params: DeleteType) => Promise<Schema | AxiosResponse<any, any>>
        },
        Schema
    > {
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

        return this as any;
    }


    /**
     * Creates a custom route handler for the specified endpoint
     * @returns 
     */
    createCustomRoutes<
        TPath,
        TOutputSchema,
        TOutput extends TOutputSchema,
        TInput,
        TExecutable = ModelWrapperFunction<TInput, TOutput>,
    >(path: string & keyof TPath, params: CustomRouteParam<TInput, TOutputSchema, TOutput>): StrapiModel<
        TEndpoint,
        InputZodSchema,
        ThisRouterRecord & { [K in keyof TPath]: TExecutable },
        Schema
    > {
        if (Object.keys(this.routes).find(key => key === path)) {
            // TODO: proper error management
            throw Error("Duplicate keys");
        }

        const executable = function (client: AxiosInstance) {
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
            } as TExecutable;
        }

        this.routes = {
            [path]: executable,
            ...this.routes
        };

        return this as any;
    }
}

export default StrapiModel;