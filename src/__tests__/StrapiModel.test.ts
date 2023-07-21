import { z } from "zod";

import { StrapiModel } from "../index";

import axios from "axios";

describe('StrapiModel', () => {
    /**
     * 
     */
    test('Create a StrapiModel', () => {
        const model = new StrapiModel("restaurants", {
            id: z.number(),
            name: z.string()
        });

        // TODO: expect model to have no routes
        expect(model.routes.restaurants).toBeDefined()
    });


    /**
     * 
     */
    test('Create a StrapiModel with default routes', async () => {
        const model = new StrapiModel("restaurants", {
            id: z.number(),
            name: z.string()
        })
        .createDefaultRoutes();

        const createRestaurant = model.routes.create(axios.create());

        const restaurant = await createRestaurant({
            name: "McDuffies"
        });
    });


    /**
     * 
     */
    test('Create a StrapiModel with custom routes', async () => {
        const model = new StrapiModel("restaurants", {
            id: z.number(),
            name: z.string()
        })
        .createCustomRoutes("addReview", {
            params: z.object({
                name: z.string()
            }),
            async handler({ input, post }) {
                // input: the values being provided to the API
                // output: the response from this function
                // client: the AxiosInstance initialised by the StrapiClient
                const response = await post({ data: input });

                return {
                    success: response.status === 200
                };
            },
        });

        const addReview = model.routes.addReview(axios.create());

        const result = await addReview({
            name: "John Smith"
        });
    });
});