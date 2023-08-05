### A type-safe client library for Strapi

The code is still very much a WIP while the core learning objective is to build a strong understanding of Typescript's type inference system.

---
Pattern:

1. Define the API endpoints
```Typescript
// ./api/strapi-models.ts

import { StrapiModel, StrapiType } from "strapi-client";

// Here we are creating a binding to the `restaurant` collection.
const restaurantModel = StrapiModel("restaurant", {
     name: StrapiType.string(),
})
// We create the default handlers using `createDefaultRoutes`.
// This will create the bindings for the following routes
// - create
// - find
// - findOne
// - update
// - delete
.createDefaultRoutes()
// We can create custom handlers for user-generated endpoints using `createCustomRoutes`.
// The first parameter is the collection endpoint we are targeting.
.createCustomRoutes("addReview", {
     // The required parameters to call this endpoint.
     // This is the data being sent to Strapi.
     params: z.object({
          rating: z.number()
     }),
     // This is the handler where we implement the calls to the Strapi API (or any other backend!).
     // The function provides de-serializable functions that have been populated with the context
     // for the API query (i.e. the baseURL + collection endpoint, TODO: add auth token ).
     // We can provide the type bindings for the data here.
     async handler({ input, post }) {
          // input: the values being provided to the API
          // output: the response from this function
          
          // get, put, post, patch, delete: axios crud operations
          const response = await post({ data: input });

          return {
               success: response.status === 200
          };
     },
});

export const models = [
     restaurantModel,
     ...
]
```

2. Initialise the client using the defined models
```Typescript
// ./api/strapi.ts

import { strapiClient } from "strapi-client";
import models from "./strapi-models";

const client = strapiClient({
     endpoint: "localhost", 
     models: models,
});

export default client;
```
3. Use the API with full type-safety guarantees

```Typescript
// ./pages/main.tsx

import api from "@core/api/strapi"

async function getRestaurants() {
     // We now have full type-safety guarantees
     const restaurants = await api.restaurant.find();
     // const restaurants: {
     //   name: string;
     // }[]

     return restaurants;
}
```
---

### TODO

- [ ] Authentication contexts (local provider)
- [ ] Error types
- [ ] Populate field expansion
- [ ] Status code dependent typing for result


---
**WIP: Strapi type definition:**


Use this when defining the schema from the database.
Use a 1-to-1 mapping of the types on the database.


``````
strapiClient default methods:
Login:       POST: /api/auth/local
Register:    POST: /api/auth/local/register
``````
