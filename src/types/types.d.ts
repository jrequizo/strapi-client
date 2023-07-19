import type { AxiosInstance } from "axios";


/************************************************************************************
 *                                    Strapi Types                                  *
 *                    The basic properties all Strapi entities have.                *
 ***********************************************************************************/

type StrapiEntity = {
    id: number,
    createdAt: Date,
    updatedAt: Date,

    // Can be returned as null
    // Can be omitted on `Create`
    publishedAt?: Date | null,
}


type StrapiImage = {
    url: string
} & StrapiEntity



type StrapiAuthResult = {
    jwt: string,
    user: MeraUser
}

type NonStrapi<T> = Omit<T, keyof StrapiEntity>;


/************************************************************************************
 *                                 Helper Types                                     *
 ***********************************************************************************/


/**
 * Construct a type where every key is optional but at least one key must exist in the object.
 */
type AtLeastOneOf<T> = Partial<T> & U<Required<T>>[keyof U<T>]
type U<T> = { [K in keyof T]: Pick<T, K> }

type NonNullRequired<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>
}>

type Without<T, V, WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V ? never
    : (T[K] extends Record<string, unknown> ? Without<T[K], V> : T[K])
}> = Pick<WithNevers, {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K
}[keyof WithNevers]>


/**
 * 
 */
type PopulateFields<T> = Partial<Omit<Pick<T, IdKeys<T> | IdKeysArray<T>>, "id">>


type PopulateCondition<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity>> = Partial<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? boolean : never) : (A[P] extends StrapiEntity ? boolean : never)
}, undefined>> | "*"

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


type UpdateParams<T, A = Omit<NonNullRequired<T>, keyof StrapiEntity | "user"> & { publishedAt: Date }> = AtLeastOneOf<Without<{
    [P in keyof A]: A[P] extends Array<infer U> ? (U extends StrapiEntity ? number[] : A[P]) : (A[P] extends StrapiEntity ? number : A[P])
}, undefined>>

type CreateTypeRequired<T> = Without<Omit<{
    [P in keyof T]: null extends T[P] ? never : T[P] extends Array<infer U> ? U extends StrapiEntity ? never : number[] : T[P]
}, keyof StrapiEntity | "user">, never>;

type CreateTypeOptional<T> = Partial<Without<Omit<{
    [P in keyof T]: null extends T[P] ? (T[P] extends Array<infer U> ? number[] : NonNullable<T[P]>) : never
}, keyof StrapiEntity | "user">, never>>;


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