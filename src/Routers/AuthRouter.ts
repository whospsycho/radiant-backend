import { Router as _Router, Request, Response } from "express";

import Client from "../database";
import { Router } from "../Typings";

import Joi from "joi";
import axios from "axios";
import Verify, { VerifySchema } from "../middleware/Verify";

import Domains from "../Utils/Domains.json";
import SearchParams from "../Utils/SearchParams";

import App from "../app";
import { server } from "..";

class AuthRouter implements Router {
  app: App = server;

  public path: string = "/register";
  public router = _Router();

  client = Client;
  env: any;

  constructor(env: any) {
    this.initializeRoute();

    this.env = env;
  }

  private initializeRoute() {
    this.router.post(this.path, 
      Verify(
        Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
          domain: Joi.string().required(),
          invite: Joi.string().required(),
        })
      ),
      async (req: Request, res: Response) => {
        const { email, password, domain, invite: code } = req.body;

        const inviteUsed = await this.client.invite.findFirst({
          where: {
            code,
          },
        });
    
        if (!inviteUsed) {
          return res.status(401).json({
            success: false,
            error: "Invalid Invite",
          });
        }
    
        if (!Domains.includes(domain)) {
          return res.status(401).json({
            success: false,
            error: "The domain provided is not a registered radiant domain",
          });
        }
    
        // fullEmail = "test" + "@domain.tld"
        const fullEmail = email + domain;
    
        const isValidEmail = VerifySchema(
          Joi.object({ email: Joi.string().email() }),
          { email: fullEmail }
        );
    
        if (!isValidEmail) {
          return res.status(401).json({
            success: false,
            error: "Invalid Email",
            errors: isValidEmail,
          });
        }
    
        const registerReq = await axios.post(
          `${this.env.MAIL_SERVER}/admin/mail/users/add`,
          new SearchParams()
            .append("email", fullEmail)
            .append("password", password)
            .append("privileges", "")
            .append("quota", "0"), // 0 = unlimited
          {
            headers: {
              'Authorization': `Basic ${this.env.MAIL_TOKEN}`,
            },
          }
        ).catch(async (error) => { 
          if (error.response) {
            console.log(error.response.data)
            console.log(error.response.headers)
          }
          return res.status(401).json({
            success: false,
            error: "Something went wrong creating your account",
            errors: error.response.data,
          });
        }).then(async (resp) => {
           if (resp.status === 200) {
             await this.client.invite.delete({
                where: {
                  code,
                },
             });
    
             return res.json({
               success: true,
               message: "Successfully created account",
             });
           }
        })
      }
    )
  }

}

export default AuthRouter;
