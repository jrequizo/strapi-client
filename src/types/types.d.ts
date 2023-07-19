import type { AxiosInstance } from "axios";



/************************************************************************************
 *                                 Helper Types                                     *
 ***********************************************************************************/


/**
 * Construct a type where every key is optional but at least one key must exist in the object.
 */
type AtLeastOneOf<T> = Partial<T> & U<Required<T>>[keyof U<T>]

type NonStrapi<T> = Omit<T, keyof StrapiEntity>;


/**
 * 
 */

type PopulateFields<T> = Partial<Omit<Pick<T, IdKeys<T> | IdKeysArray<T>>, "id">>


/**
 * 
 */
type WhereCondition<T, A = NonNullRequired<T>> = AtLeastOneOf<Required<{
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
type WhereFilterCommon<T> = Partial<{
    $null: boolean
    $notNull: boolean
    $eq: T
    $ne: T
}>

/**
 * Where conditions applicable to strings.
 */
type WhereFilterString<T> = AtLeastOneOf<Partial<{
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
type WhereFilterNumberOrDate<T> = AtLeastOneOf<Partial<{
    $gt: T,
    $gte: T,
    $lt: T,
    $lte: T,
    $between: T
} & WhereFilterCommon<T>>>

/**
 * Where conditions applicable to Array<T>.
 */
type WhereFilterArray<T, U> = AtLeastOneOf<Partial<{
    $in: AtLeastOneOf<U>,
    $notIn: AtLeastOneOf<U>,
} & WhereFilterCommon<U[]>>>


type PopulateCondition<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity>> = Partial<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? boolean : never) : (A[P] extends StrapiEntity ? boolean : never)
}, undefined>> | "*"


type UpdateParams<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity | "user"> & { publishedAt: Date }> = AtLeastOneOf<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? number[] : A[P]) : (A[P] extends StrapiEntity ? number : A[P])
}, undefined>>


/************************************************************************************
 *                            Abstracted CRUD Types                                 *
 ***********************************************************************************/

/**
 * 
 */
type CreateType<T, A = CreateTypeRequired<T>, B = CreateTypeOptional<T>> = {
    [P in keyof A]: A[P] extends StrapiEntity ? number : A[P]
} &
{ [P in keyof B]?: B[P] extends StrapiEntity | undefined ? number : B[P] } &
{ publishedAt?: Date };


type FindType<IFind> = {
    filters?: WhereCondition<Omit<IFind, "createdAt" | "UpdatedAt">>,
    populate?: PopulateCondition<Omit<IFind, "createdAt" | "UpdatedAt">>,
    publicationState?: "live" | "preview"
};

type UpdateType<IUpdate> = { id: number, update: UpdateParams<NonStrapi<IUpdate>> };


type DeleteType = { id: number };