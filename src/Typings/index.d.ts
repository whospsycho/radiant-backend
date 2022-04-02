import { Router as _Router } from 'express'
import { App } from '../app'

namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    ADMIN_API_KEY: string;
    MAIL_TOKEN: string;
    MAIL_SERVER: string;
  }
}

export interface Router {
    private app: App,
    private client;
    public path: string, 
    public router: _Router,
}