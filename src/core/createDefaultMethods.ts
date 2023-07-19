import { ZodSchema } from "zod";

import { AxiosInstance } from "axios";

import { create } from "../functions/create";
import { find } from "../functions/find";
import { findOne } from "../functions/findOne";
import { update } from "../functions/update";
import { remove } from "../functions/delete";

import { AtLeastOneOf, CreateType, DeleteType, FindType, UpdateType } from "../types/types";


/**
 * Create the base functions for the crud accessors.
 * The base function returns the executable crud function that calls the Strapi API.
 * Needs to be provided with an axios client instance to run with.
 */
export const createDefaultMethods = <
    TSchema extends { [x: string]: ZodSchema },
    CreateSchema = TSchema,
    FindSchema = TSchema,
    UpdateSchema = TSchema,
>(routerPath: string) => {
    // Define these out here so we can allow the user to define a type that is passed into the following transformers
    type CreateInput = CreateType<CreateSchema>;
    type FindInput = FindType<FindSchema>;
    type UpdateInput = UpdateType<UpdateSchema>;

    return {
        createBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<CreateInput>) => {
                return await create<CreateInput, TSchema>(client, routerPath, params);
            }
        },

        findBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<FindInput>) => {
                return await find<FindInput, TSchema>(client, routerPath, params);
            }
        },

        findOneBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<FindInput>) => {
                return await findOne<FindInput, TSchema>(client, routerPath, params);
            }
        },

        updateBase(client: AxiosInstance) {
            return async (params: AtLeastOneOf<UpdateInput>) => {
                return await update<UpdateSchema, UpdateInput, TSchema>(client, routerPath, params);
            }
        },

        deleteBase(client: AxiosInstance) {
            return async (params: DeleteType) => {
                return await remove<TSchema>(client, routerPath, params);
            }
        },
    }
}