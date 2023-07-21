
**Strapi type definition:**


Use this when defining the schema from the database.
Use a 1-to-1 mapping of the types on the database.


``````
strapiClient default methods:
Login:       POST: /api/auth/local
Register:    POST: /api/auth/local/register
``````

---
Pattern:

```Typescript
// ./api/strapi.ts

import { strapiClient } from "strapi-client";
import models from "./strapi-models";

const api = strapiClient({
     endpoint: "localhost", 
     models: models,
});

export default api;
```


```Typescript
// ./api/strapi-models.ts

import { StrapiModel, StrapiType } from "strapi-client";

const restaurantModel = StrapiModel("restaurant", {
     name: StrapiType.string(),
})
.createDefaultRoutes()
.createCustomRoute()

export const models = [
     restaurantModel,
     ...
]
```

```Typescript
// ./pages/main.tsx

import api from "@core/api/strapi"

async function getRestaurants() {
     const restaurants = await api.restaurant.find();

     return restaurants;
}
```
