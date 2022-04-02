import "dotenv/config";
import cors from "cors";
import helmet from "helmet";
import { env } from "node:process"
import express, {json} from "express";
import { PrismaClient } from "@prisma/client";
import AuthRouter from "./Routers/AuthRouter";
import AdminRouter from "./Routers/AdminRouter";

const app = express();
// personally id use module aug to do this but wtv
export const client = new PrismaClient();

app.use(json())
app.set("x-powered-by", "radiant.cool");

app.use(
  helmet({
    noSniff: true,
    xssFilter: true,
  })
);

app.use(
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

app.use("/auth", AuthRouter);
app.use("/admin", AdminRouter);

app.listen(env.PORT, () => {
  console.log("Listening on port " + env.PORT);
});
