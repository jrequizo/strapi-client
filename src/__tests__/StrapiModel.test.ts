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
        expect(model.routes.restaurants).toBeDefined();
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

        expect(model.routes.create).toBeDefined();
        expect(model.routes.delete).toBeDefined();
        expect(model.routes.find).toBeDefined();
        expect(model.routes.findOne).toBeDefined();
        expect(model.routes.update).toBeDefined();
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
        
        expect(model.routes.addReview).toBeDefined();
    });
});