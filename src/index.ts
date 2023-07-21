import StrapiClient from "./core/StrapiClient";
import StrapiModel from "./core/StrapiModel";

export {
    StrapiClient,
    StrapiModel
};

/**
 * Strapi type definitions.
 * 
 * Use this when defining the schema from the database.
 * Use a 1-to-1 mapping of the types on the database.
 */


/**
 * strapiClient default methods:
 * Login:       POST: /api/auth/local
 * Register:    POST: /api/auth/local/register
 * 
 * 
 * pattern:
 */

/**
 * ./api/strapi.ts
 * 
 * import { strapiClient } from "strapi-client";
 * import models from "./strapi-models";
 * 
 * const api = strapiClient({
 *      endpoint: "localhost", 
 *      models: models,
 * });
 * 
 * export default api;
 */

/**
 * ./api/strapi-models.ts
 * 
 * import { StrapiModel, StrapiType } from "strapi-client";
 * 
 * const restaurantModel = StrapiModel("restaurant", {
 *      name: StrapiType.string(),
 * })
 * .createDefaultRoutes()
 * .createCustomRoute()
 * 
 * export const models = [
 *      restaurantModel,
 *      ...
 * ]
 */

/**
 * ./pages/main.tsx
 * 
 * import api from "@core/api/strapi"
 * 
 * async function getRestaurants() {
 *      const restaurants = await api.restaurant.find();
 * 
 *      return restaurants;
 * }
 */

import { z } from "zod";

const restaurantsModel = new StrapiModel("restaurants", {
    id: z.number(),
    name: z.string()
}).createDefaultRoutes();

const reviewsModel = new StrapiModel("reviews", {
    id: z.number(),
    rating: z.number()
}).createCustomRoutes("addReview", {
    async handler() {
        return {
            hello: "world!"
        }
    },
});

const client = new StrapiClient({
    baseURL: 'localhost',
    models: [restaurantsModel, reviewsModel]
});

async function run() {
    const result = await client.api.reviews.addReview();

    console.log(result);
}

run();