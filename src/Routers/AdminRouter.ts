import { client } from "..";
import { Router } from "express";
import VerifyAdmin from "../middleware/VerifyAdmin";
import { generateInviteCode } from "../Utils/Generate";

const adminRouter = Router();

adminRouter.post("/makeInvite", VerifyAdmin, async (_, res) => {
  const code = generateInviteCode();

  const invite = await client.invite.create({
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
});

export default adminRouter;
