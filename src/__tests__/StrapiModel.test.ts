import { z } from "zod";

import { StrapiModel } from "../index";

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
    test('Create a StrapiModel with default routes', () => {
        const model = new StrapiModel("restaurants", {
            id: z.number(),
            name: z.string()
        })
        .createDefaultRoutes()

        
    });


    /**
     * 
     */
    test('Create a StrapiModel with custom routes', () => {
        const model = new StrapiModel("restaurants", {
            id: z.number(),
            name: z.string()
        })
        .createCustomRoute("addReview", {
            params: z.object({
                name: z.string()
            }),
            response: z.object({
                name: z.string(),
            }),
            async handler({ input, post }) {
                // input: the values being provided to the API
                // output: the response from this function
                // client: the AxiosInstance initialised by the StrapiClient
                const response = await post({ data: input });

                return response.data;
            },
        });

        
    });
});