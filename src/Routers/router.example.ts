
import { Router as _Router, Request, Response } from "express";
import { Router } from "../Typings";

import App from "../app";
import { server } from "..";
import Client from "../database";

class ExampleRouter implements Router {
    app: App = server;

    public path: string = "/path";
    public router = _Router();
  
    client = Client;
    env: any;
  
    constructor(env: any) {
      this.initializeRoute();
  
      this.env = env;
    }
  
    private initializeRoute() {
        this.router.get(this.path, (req: Request, res: Response) => {
            res.sendStatus(200);
        })
    }
}