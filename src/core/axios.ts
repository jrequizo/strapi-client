import a from "axios";

class Requester {
    // TODO: env variable for localhost / staging / prod
    private _client = a.create({
        baseURL: "http://192.168.145.167:1337/api/"
    });

    setBearer(bearer: string) {
        if (bearer.length > 0) {
            this._client.defaults.headers.common.Authorization = `Bearer ${bearer}`;
        }
    }

    clearBearer() {
        delete this._client.defaults.headers.common.Authorization;
    }

    get = this._client.get;
    post = this._client.post;
    put = this._client.put;
    patch = this._client.patch;
    delete = this._client.delete;
}

export const axios = new Requester();