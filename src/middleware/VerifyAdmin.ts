import { env } from "node:process";
import { Request, Response, NextFunction } from "express";

export default function VerifyAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.headers.authorization !== env.ADMIN_API_KEY) {
        return res.status(401).json({
            success: false,
            error: "Invalid API key"
        });
    }

    next();
}