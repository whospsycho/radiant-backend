import Joi from "joi";
import axios from "axios";
import { client } from "..";
import { env } from "node:process";
import { Router, Request } from "express";
import Domains from "../Utils/Domains.json";
import SearchParams from "../Utils/SearchParams";
import Verify, { VerifySchema } from "../middleware/Verify";

const authRouter = Router();

authRouter.post(
  "/register",
  Verify(
    Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      domain: Joi.string().required(),
      invite: Joi.string().required(),
    })
  ),
  async (req: Request, res) => {
    const { email, password, domain, invite: code } = req.body;

    const inviteUsed = await client.invite.findFirst({
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
      `${env.MAIL_SERVER}/admin/mail/users/add`,
      new SearchParams()
        .append("email", fullEmail)
        .append("password", password)
        .append("privileges", "")
        .append("quota", "0"), // 0 = unlimited
      {
        headers: {
          'Authorization': `Basic ${env.MAIL_TOKEN}`,
        },
      }
    ).catch(async (error) => { 
      console.log(`An error occured. (reason?: ${error.response.headers["x-reason"]})`);
      return res.status(401).json({
        success: false,
        error: "Something went wrong creating your account",
        errors: error.response.data,
      });
    }).then(async (resp) => {
   
       await client.invite.delete({
          where: {
            code,
          },
       });

       return res.json({
         success: true,
         message: "Successfully created account",
       });
    })
  }
);

export default authRouter;
