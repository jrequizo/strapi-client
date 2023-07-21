
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