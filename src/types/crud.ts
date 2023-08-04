/************************************************************************************
 *                                 Helper Types                                     *
 ***********************************************************************************/

import { NonNullRequired, Without, AtLeastOneOf } from "./util"
import { StrapiEntity, NonStrapi } from "./strapi"


export type PopulateCondition<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity>> = Partial<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? boolean : never) : (A[P] extends StrapiEntity ? boolean : never)
}, undefined>> | "*"

/**
 * 
 */
export type WhereCondition<T, A = NonNullRequired<T>> = AtLeastOneOf<Required<{
    [P in keyof A]?: A[P] extends Array<infer U> ? WhereFilterArray<T, U> :
    A[P] extends Date ? WhereFilterNumberOrDate<A[P]> :
    A[P] extends string ? WhereFilterString<string> :
    A[P] extends number ? WhereFilterNumberOrDate<A[P]> :
    A[P] extends Record<string, unknown> ? WhereCondition<A[P]> :
    AtLeastOneOf<WhereFilterCommon<A[P]>>
}>>

/**
 * Where conditions applicable to all types.
 */
export type WhereFilterCommon<T> = Partial<{
    $null: boolean
    $notNull: boolean
    $eq: T
    $ne: T
}>

/**
 * Where conditions applicable to strings.
 */
export type WhereFilterString<T> = AtLeastOneOf<Partial<{
    $eqi: T
    $startsWith: T
    $startsWithi: T
    $endsWith: T
    $endsWithi: T
    $contains: T
    $containsi: T
    $notContains: T
    $notContainsi: T
} & WhereFilterCommon<T>>>

/**
 * Where conditions applicable to numbers or Date objects.
 */
export type WhereFilterNumberOrDate<T> = AtLeastOneOf<Partial<{
    $gt: T,
    $gte: T,
    $lt: T,
    $lte: T,
    $between: T
} & WhereFilterCommon<T>>>

/**
 * Where conditions applicable to Array<T>.
 */
export type WhereFilterArray<T, U> = AtLeastOneOf<Partial<{
    $in: AtLeastOneOf<U>,
    $notIn: AtLeastOneOf<U>,
} & WhereFilterCommon<U[]>>>


export type UpdateParams<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity | "user"> & { publishedAt: Date }> = AtLeastOneOf<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? number[] : A[P]) : (A[P] extends StrapiEntity ? number : A[P])
}, undefined>>

export type CreateTypeRequired<T> = Without<Omit<{
    [P in keyof T]: null extends T[P] ? never : T[P] extends Array<infer U> ? U extends StrapiEntity ? never : number[] : T[P]
}, keyof StrapiEntity | "user">, never>;

export type CreateTypeOptional<T> = Partial<Without<Omit<{
    [P in keyof T]: null extends T[P] ? (T[P] extends Array<infer U> ? number[] : NonNullable<T[P]>) : never
}, keyof StrapiEntity | "user">, never>>;


/************************************************************************************
 *                            Abstracted CRUD Types                                 *
 ***********************************************************************************/

/**
 * 
 */
export type CreateType<T, A = CreateTypeRequired<T>, B = CreateTypeOptional<T>> = {
    [P in keyof A]: A[P] extends StrapiEntity ? number : A[P]
} &
    { [P in keyof B]?: B[P] extends StrapiEntity | undefined ? number : B[P] } &
{ publishedAt?: Date };


export type FindType<IFind> = {
    filters?: WhereCondition<Omit<IFind, "createdAt" | "UpdatedAt">>,
    populate?: PopulateCondition<Omit<IFind, "createdAt" | "UpdatedAt">>,
    publicationState?: "live" | "preview"
};

export type UpdateType<IUpdate> = { id: number, update: UpdateParams<NonStrapi<IUpdate>> };


export type DeleteType = { id: number };