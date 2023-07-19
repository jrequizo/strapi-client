import { transformToDate } from "./transform";

export function parseOutput(raw: unknown) {
    if (Array.isArray(raw)) {
        return parseArray(raw) as any;
    } else {
        return parse(raw) as any;
    }
}


function parseArray<T>(data: unknown) {
    const resultRaw = data as {
        id: number,
        attributes: Omit<T, "id">
    }[];

    const result = resultRaw.map((entry) => {
        return parse(entry);
    });

    const transformed = transformToDate(result);

    return transformed as any as any[];
}

function parse(data: any) {
    const parsed = {
        id: data.id,
        ...data.attributes
    } as any

    Object.keys(parsed).forEach((key) => {
        if (parsed[key]) {
            if (parsed[key].hasOwnProperty("data")) {
                if (parsed[key].data) {
                    if (Array.isArray(parsed[key].data)) {
                        // Array, parse each value
                        parsed[key] = parsed[key].data.map((value: { id: number; attributes: any; }) => {
                            return {
                                id: value.id,
                                ...value.attributes
                            }
                        })
                    } else {
                        parsed[key] = {
                            id: parsed[key].data.id,
                            ...parsed[key].data.attributes
                        }
                    }
                } else {
                    parsed[key] = null
                }
            }
        }
    });

    const transformed = transformToDate(parsed);

    return transformed;
}