import Joi from "joi";
import axios from "axios";
import { client } from "..";
import { Router } from "express";
import Domains from "../Utils/Domains.json";
import SearchParams from "../Utils/SearchParams";
import Verify, { VerifySchema } from "../middleware/Verify";

const authRouter = Router();

authRouter.get(
  "/register",
  Verify(
    Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
      domain: Joi.string().required(),
      invite: Joi.string().required(),
    })
  ),
  async (req, res) => {
    const { email, password, domain, invite: code } = req.body;

    const inviteUsed = await client.invites.findFirst({
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

    // this doesnt make sense unless the email is like yepp@ and the domain is ok.com
    // aka idk where the @ sign would come in (if it does at all)
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
      `${process.env.MAIL_SERVER}/mail/users/add`,
      new SearchParams()
        .append("email", fullEmail)
        .append("password", password)
        .append("privileges", ""),
      {
        headers: {
          Authorization: `Basic ${process.env.MAIL_TOKEN}`,
        },
      }
    );

    if (registerReq.status !== 200) {
      return res.status(401).json({
        success: false,
        error: "Something went wrong creating your account",
        errors: registerReq.data,
      });
    }

    await client.invites.delete({
      where: {
        code,
      },
    });

    return res.json({
      success: true,
      message: "Successfully created account",
    });
  }
);

export default authRouter;
