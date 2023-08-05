import { z } from "zod";

import { StrapiModel, StrapiClient } from "../index";

describe('StrapiModel', () => {
    test('Create a StrapiClient with no models', async () => {
        const client = new StrapiClient({
            baseURL: 'localhost',
            models: []
        });

        expect(client.api).toMatchObject({});
    });
    /**
     * 
     */
    test('Create a StrapiClient with default routes', async () => {
        const restaurantsModel = new StrapiModel("restaurants", {
            name: z.string()
        }).createDefaultRoutes();

        const reviewsModel = new StrapiModel("reviews", {
            id: z.number(),
            rating: z.number()
        }).createCustomRoutes("addReview", {
            params: z.optional(z.object({
                id: z.number(),
            })),
            async handler() {
                return {
                    hello: "world!"
                }
            }
        });

        const client = new StrapiClient({
            baseURL: 'localhost',
            models: [restaurantsModel, reviewsModel]
        });

        const result = await client.api.restaurants.find({
           populate: "*" 
        });
    });
});