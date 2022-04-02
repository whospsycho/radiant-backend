import { Router } from "../Typings";

import VerifyAdmin from "../middleware/VerifyAdmin";
import { generateInviteCode } from "../Utils/Generate";
import { Router as _Router } from "express";

import App from "../app";
import { server } from "..";
import Client from "../database";
class AdminRouter implements Router {
  app: App = server;

  public path: string = "/makeInvite";
  public router = _Router();

  client = Client;

  constructor(env: unknown) {
    this.initializeRoute();
  }

  private initializeRoute() {
    this.router.post(this.path, VerifyAdmin, async (_ , res) => {
      const code = generateInviteCode();

      const invite = await this.client.invite.create({
        data: {
          code,
        },
      });
    
      if (!invite) {
        return res.status(500).json({
          success: false,
          error: "Failed to create invite",
        });
      }
    
      res.json({
        success: true,
        invite,
      });
    }) 
  }
}

export default AdminRouter;
