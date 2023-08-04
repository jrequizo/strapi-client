import { z } from "zod";

import { StrapiModel, StrapiClient } from "../index";

describe('StrapiModel', () => {
    /**
     * 
     */
    test('Create a StrapiClient', async () => {
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

        // TODO: fix `AtLeastOneOf` for find params
        client.api.restaurants.find({
           populate: "*" 
        });

        client.api.restaurants.update({
            id: 0,
            update: {
                name: "asdf"
                
            }
        }) 

        client.api.restaurants.create({
            name: "asdf"
        })
        
        client.api.reviews.addReview();
    });
});