import { ZodSchema } from "zod";

import { AxiosInstance } from "axios";

import { create } from "../functions/create";
import { find } from "../functions/find";
import { findOne } from "../functions/findOne";
import { update } from "../functions/update";
import { remove } from "../functions/delete";


/**
 * Create the base functions for the crud accessors.
 * The base function returns the executable crud function that calls the Strapi API.
 * Needs to be provided with an axios client instance to run with.
 */
export const createDefaultMethods = <
    TShema extends { [x: string]: ZodSchema },
    ICreate = TShema,
    IFind = TShema,
    IUpdate = TShema,
    // Define these out here so we can allow the user to define a type that is passed into the following transformers
    ICreateParams = CreateType<ICreate>,
    IFindParams = FindType<IFind>,
    IUpdateParams = UpdateType<IUpdate>,
    IDeleteParams = DeleteType,
>(routerPath: string) => {
    return {
        createBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<ICreateParams>) => {
                return await create<ICreateParams, TShema>(client, routerPath, params);
            }
        },

        findBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<IFindParams>) => {
                return await find<TShema>(client, routerPath, params);
            }
        },

        findOneBase(client: AxiosInstance) {
            return async (params?: AtLeastOneOf<IFindParams>) => {
                return await findOne<TShema>(client, routerPath, params);
            }
        },

        updateBase(client: AxiosInstance) {
            return async (params: AtLeastOneOf<IUpdateParams>) => {
                return await update<TShema>(client, routerPath, params);
            }
        },

        deleteBase(client: AxiosInstance) {
            return async (params: IDeleteParams) => {
                return await remove<TShema>(client, routerPath, params);
            }
        },
    }
}