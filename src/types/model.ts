import { ZodSchema } from "zod";

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

import StrapiModel from "../core/StrapiModel";


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
    }) => Promise<TOutput>,
}

export type ModelRecord<TInput, TOutputSchema, TOutput extends TOutputSchema> = {
    // [key: string]: CustomRouteParam<TInput, TOutputSchema, TOutput>
    [path: string]: RouterBaseFunction<TInput, TOutput>
}

export type AnyModelRecord = ModelRecord<any, any, any>

export type StrapiModelSchema<PropertyType> = { [x: string]: ZodSchema<PropertyType> };

export type AnyStrapiModel = Omit<typeof StrapiModel<any, any, any>, "prototype">;

type ToObject<Model> = Model extends StrapiModel<infer Endpoint, infer Schema, infer RouterRecord>
    ? { [P in keyof Endpoint]: RouterRecord } : never;

type ToObjectsArray<T> = {
    [I in keyof T]: ToObject<T[I]>
};

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
// @ts-ignore
export type StrapiModelMap<Models> = UnionToIntersection<ToObjectsArray<Models>[number]>;