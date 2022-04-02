import "dotenv/config";

import {
  port,
  str,
  cleanEnv,
} from 'envalid';

import App from "./app";

import AdminRouter from "./Routers/AdminRouter";
import AuthRouter from "./Routers/AuthRouter";

const env = cleanEnv(process.env, {
  PORT: port(),
  ADMIN_API_KEY: str(),
  MAIL_TOKEN: str(),
  MAIL_SERVER: str(),
});

export const server = new App(
  [
    new AdminRouter(env),
    new AuthRouter(env)
  ]
);

server.listen( env.PORT );