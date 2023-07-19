import { ZodSchema } from "zod";

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";


/**
 * 
 */

export type RouterBaseFunction<TInput, TOutput> = (client: AxiosInstance) => RouterExecutableFunction<TInput, TOutput>;

export type RouterExecutableFunction<TInput, TOutput> = (params: TInput) => Promise<TOutput>;

export type CustomRouteParam<TInput, TOutputSchema, TOutput extends TOutputSchema> = {
    params?: ZodSchema<TInput>,
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
    }) => TOutput,
}

export type RouterRecord<TInput, TOutputSchema, TOutput extends TOutputSchema> = {
    // [key: string]: CustomRouteParam<TInput, TOutputSchema, TOutput>
    [path: string]: RouterBaseFunction<TInput, TOutput>
}

export type AnyRouterRecord = RouterRecord<any, any, any>

export type StrapiModelSchema<PropertyType> = { [x: string]: ZodSchema<PropertyType> };