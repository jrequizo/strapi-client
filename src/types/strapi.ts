/************************************************************************************
 *                                    Strapi Types                                  *
 *                    The basic properties all Strapi entities have.                *
 ***********************************************************************************/

export type StrapiEntity = {
    id: number,
    createdAt: Date,
    updatedAt: Date,

    // Can be returned as null
    // Can be omitted on `Create`
    publishedAt?: Date | null,
}


export type StrapiImage = {
    url: string
} & StrapiEntity


export type NonStrapi<T> = Omit<T, keyof StrapiEntity>;
