import StrapiClient from "./core/StrapiClient";
import StrapiModel from "./core/StrapiModel";

export {
    StrapiClient,
    StrapiModel
};

// import { z } from "zod";

// const restaurantsModel = new StrapiModel("restaurants", {
//     id: z.number(),
//     name: z.string()
// }).createDefaultRoutes();

// const reviewsModel = new StrapiModel("reviews", {
//     id: z.number(),
//     rating: z.number()
// }).createCustomRoutes("addReview", {
//     async handler() {
//         return {
//             hello: "world!"
//         }
//     },
// });

// const client = new StrapiClient({
//     baseURL: 'localhost',
//     models: [restaurantsModel, reviewsModel]
// });

// async function run() {
//     const result = await client.api.reviews.addReview();
//     // client.api.restaurants.find()

//     console.log(result);
// }

// run();