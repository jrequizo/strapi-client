/**
 * Utility functions to transform Date objects to string and back into Date objects.
 */

export const transformToString = (data: { [key: string]: any }): { [key: string]: string | boolean | number | Object } => {
    Object.keys(data).forEach((key) => {
        if (data[key] instanceof Date) {
            data[key] = (data[key] as Date).toISOString();
        } else if (data[key] instanceof Object) {
            data[key] = transformToString(data[key]);
        }
    });

    return data;
}

const IsStringDateRegex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/


/**
 * Transforms the response data back into Date objects.
 * @param data 
 */
export const transformToDate = (data: { [key: string]: any }): { [key: string]: string | boolean | number | Object } => {
    Object.keys(data).forEach((key) => {
        if (typeof(data[key]) === "string") {
            if (IsStringDateRegex.test(data[key])) {
                data[key] = new Date(data[key]);
            }
            // Regex check if the value is an ISODate string
            // TODO: check for array types
        } else if (data[key] instanceof Array) {
            data[key] = data[key].map((item: any) => {
                return transformToDate(item);
            })
        } else if (data[key] instanceof Object) {
            data[key] = transformToDate(data[key]);
        }
    });

    return data;
}