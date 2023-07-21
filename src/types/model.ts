import { ZodSchema } from "zod";

import type { AxiosInstance } from "axios";

import StrapiModel from "../core/StrapiModel";


/**
 * 
 */

export type ModelWrapperFunction<TInput, TOutput> = (client: AxiosInstance) => ModelExecutableFunction<TOutput, TInput>;

export type ModelExecutableFunction<TOutput, TInput = void> = TInput extends null ? () => Promise<TOutput> : (params: TInput) => Promise<TOutput>;

export type ModelRecord<TInput, TOutputSchema, TOutput extends TOutputSchema, TPath> = {
    // [key: string]: CustomRouteParam<TInput, TOutputSchema, TOutput>
    [K in keyof TPath]: ModelWrapperFunction<TOutput, TInput>
}

export type AnyModelRecord = ModelRecord<any, any, any, any>

export type StrapiModelSchema<PropertyType> = { [x: string]: ZodSchema<PropertyType> };

export type AnyStrapiModel = Omit<typeof StrapiModel<any, any, any>, "prototype">;

type ToObject<Model> = Model extends StrapiModel<infer Endpoint, infer TZodSchema, ModelRecord<any, any, any, infer TPath>>
    ? {
        [E in keyof Endpoint]: {
            [P in keyof TPath]: Model["routes"][P] extends ModelWrapperFunction<infer TOutput, infer TInput> ? ModelExecutableFunction<TOutput, TInput> : never
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