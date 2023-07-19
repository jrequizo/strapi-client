


type Executable<Schema> = (input: Schema) => void;

type AnyExecutable = Executable<any>;


interface RouterRecord<Handler extends AnyExecutable> {
    [key: string]: { handler: Handler }
}


type AnyRouterRecord = RouterRecord<any>;


class RouterFactory<CurrentRouterRecord extends AnyRouterRecord> {

    routes: CurrentRouterRecord = {} as CurrentRouterRecord;

    addRoute<NewRouterRecord extends AnyRouterRecord>(params: NewRouterRecord): RouterFactory<NewRouterRecord & CurrentRouterRecord> {
        const newRouterRecords: AnyRouterRecord = {}

        for (const [key, executable] of Object.entries(params)) {
            newRouterRecords[key] = executable;
        }

        const routes = {
            ...newRouterRecords,
            ...this.routes
        }

        this.routes = routes as NewRouterRecord & CurrentRouterRecord;
        
        

        return this as any;
    }
}


interface Restaurant {
    id: number,
    name: string,
    isOpen: boolean
}

const routerFactory = new RouterFactory();

const routes = routerFactory.addRoute({
    call: {
        handler: (mobileNo: number) => {

        }
    },
    close: {
        handler: (time: Date) => {

        }
    }
}).addRoute({
    open: {
        handler: (start: Date, end: Date) => {

        }
    },
});

routes.routes.call.handler(0);
routes.routes.close.handler(new Date());
routes.routes.open.handler(new Date(), new Date());