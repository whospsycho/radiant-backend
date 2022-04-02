import express, { Application, json } from 'express';

import cors from "cors";
import helmet from "helmet";

import { PrismaClient } from '@prisma/client';

import { Router } from './Typings';

class App {
    public _app: Application;
    public client;

    constructor(routes: Router[]) {
        this._app = express();

        this.client = new PrismaClient()
    }

    public get app() : Application {
        return this._app;
    }

    private getMiddlewares() {
        this.app.use(json())
        this.app.set("x-powered-by", "radiant.cool");

        this.app.use(
            helmet({
                noSniff: true,
                xssFilter: true,
            })
        );

        this.app.use(
            cors({
                origin: [
                "https://www.radiant.cool",
                "https://radiant.cool",
                "http://localhost:3000",
                "http://localhost:3001",
                "https://api.radiant.cool",
                "https://mail.radiant.cool",
                ],
                credentials: true,
            })
        );
    }

    public listen(PORT: number) {
        this.app.listen(PORT, () => {
            console.log(`[+] Listening on port ${PORT}!`)
        })
    }
}

export default App;