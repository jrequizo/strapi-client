import { ZodSchema, z } from "zod";

import type { AxiosInstance } from "axios";

import StrapiModel from "../core/StrapiModel";



/**
 * 
 */

export type ModelWrapperFunction<TInput, TOutput> = (client: AxiosInstance) => ModelExecutableFunction<TInput, TOutput>;

export type ModelExecutableFunction<TInput, TOutput> = TInput extends Object ?
    (params: TInput) => Promise<TOutput>
    : () => Promise<TOutput>;

export type ModelRecord<TInput, TOutputSchema, TOutput extends TOutputSchema, TPath> = {
    [K in keyof TPath]: ModelWrapperFunction<TInput, TOutput>
}

export type AnyModelRecord = ModelRecord<any, any, any, any>

export type StrapiModelSchema<PropertyType> = { [x: string]: ZodSchema<PropertyType> };

export type AnyStrapiModel = Omit<typeof StrapiModel<any, any, any>, "prototype">;

/**
 * https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
 * Transforms a StrapiModel object to an object with the TPath as the key
 * i.e.
 * ```
 * const myModel = new StrapiModel("myPath", ...);
 * type myModelTransformed = TransformPathToKey<typeof myModel>; // Results in...
 * {
 *     myPath: {
 *        ...
 *     }
 * }
 * ```
 */
export type TransformPathToKey<Model> = Model extends StrapiModel<infer Endpoint, infer TZodSchema, ModelRecord<any, any, any, infer TPath>>
    ? {
        [E in keyof Endpoint]: {
            [P in keyof TPath]: Model["routes"][P] extends ModelWrapperFunction<any, any> ? ReturnType<Model["routes"][P]> : never
        }
    } : never;

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// @ts-ignore
export type StrapiModelMap<Models> = UnionToIntersection<TransformPathToKey<Models>[number]>;

/**
 * https://stackoverflow.com/questions/60862509/typescript-types-from-array-to-object
 */