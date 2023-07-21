import { ZodSchema } from "zod";

import type { AxiosInstance } from "axios";

import StrapiModel from "../core/StrapiModel";



/**
 * 
 */

export type ModelWrapperFunction<TInput, TOutput> = (client: AxiosInstance) => ModelExecutableFunction<TInput, TOutput>;

export type ModelExecutableFunction<TInput, TOutput> = TInput extends { [key: string]: unknown } ? (params: TInput) => Promise<TOutput> : () => Promise<TOutput>;

export type ModelRecord<TInput, TOutputSchema, TOutput extends TOutputSchema, TPath> = {
    [K in keyof TPath]: ModelWrapperFunction<TInput, TOutput>
}

export type AnyModelRecord = ModelRecord<any, any, any, any>

export type StrapiModelSchema<PropertyType> = { [x: string]: ZodSchema<PropertyType> };

export type AnyStrapiModel = Omit<typeof StrapiModel<any, any, any>, "prototype">;

type ToObject<Model> = Model extends StrapiModel<infer Endpoint, infer TZodSchema, ModelRecord<any, any, any, infer TPath>>
    ? {
        [E in keyof Endpoint]: {
            [P in keyof TPath]: Model["routes"][P] extends ModelWrapperFunction<infer TInput, infer TOutput> ? ModelExecutableFunction<TInput, TOutput> : never
        }
    } : never;

type ToObjectsArray<T> = {
    [I in keyof T]: ToObject<T[I]>
};

type UnionToIntersection<U> =
    (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
// @ts-ignore
export type StrapiModelMap<Models> = UnionToIntersection<ToObjectsArray<Models>[number]>;