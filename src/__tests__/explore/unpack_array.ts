import { ZodSchema, z } from "zod";


// type Collection<TInput, TOutput> = {
//     input: ZodSchema<TInput>,
//     callback: (params: TInput) => TOutput;
// }


// function createCollection<TInput, TOutput>(params: Collection<TInput, TOutput>): Collection<TInput, TOutput> {
//     return params;
// }

// const ACollection = createCollection({
//     input: z.object({
//         id: z.number()
//     }),
//     callback(params) {
//         return params.id > 0;
//     },
// });

// const BCollection = createCollection({
//     input: z.object({
//         name: z.string(),
//         description: z.string()
//     }),
//     callback(params) {

//     },
// });

// type ToObject<Model> = Model extends StrapiModel<infer Endpoint, infer TZodSchema, ModelRecord<any, any, any, infer TPath>>
//     ? {
//         [E in keyof Endpoint]: {
//             [P in keyof TPath]: Model["routes"][P] extends ModelWrapperFunction<infer TInput, infer TOutput> ? ModelExecutableFunction<TInput, TOutput> : never
//         }
//     } : never;

// type ToObjectsArray<T> = {
//     [I in keyof T]: ToObject<T[I]>
// };

// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// @ts-ignore
// export type StrapiModelMap<Models> = UnionToIntersection<ToObjectsArray<Models>[number]>;

const myFunctions1 = {
    myFunctions1: {
        reviews: (params: { id: number, date?: Date }) => {
            return true;
        },
        delete: (params: { id: number }) => {
            return ""
        },
        search: (params?: { query: string }) => {

        }
    }
}

const myFunctions2 = {
    myFunctions2: {
        find: (params?: { query: string }) => {

        }
    }
}

const myFunctionsArray = [myFunctions1, myFunctions2];

type UTOI<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Unpacks the array into a union of constituent member types
 * e.g. an array consisting of `[MyTypeA, MyTypeB]`
 * will result in `MyTypeA | MyTypeB`
 */
type A = typeof myFunctionsArray[number];

/**
 * To turn this type into a union:
 */
type B = UTOI<A>;
