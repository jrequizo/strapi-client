/**
 * Construct a type where every key is optional but at least one key must exist in the object.
 */
export type AtLeastOneOf<T> = Partial<T> & U<Required<T>>[keyof U<T>]
type U<T> = { [K in keyof T]: Pick<T, K> }

/**
 * Transforms all properties to remove `null`, `undefined`, and optional unions 
 * i.e. { <key>?: <property> | null | undefined } => { <key> : <property> }
 */
export type NonNullRequired<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>
}>

/**
 * Removes properties whose types are of `T`.
 */
export type Without<T, V, WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V ? never
    : (T[K] extends Record<string, unknown> ? Without<T[K], V> : T[K])
}> = Pick<WithNevers, {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K
}[keyof WithNevers]>
