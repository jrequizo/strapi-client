import { z } from "zod";

import { StrapiModel, StrapiClient } from "../index";

describe('StrapiModel', () => {
    /**
     * 
     */
    test('Create a StrapiClient', () => {
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
        // client.api.restaurants.create({})
    });
});