import e, { Request, Response, Router } from 'express';
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const path = require("path");
const router = Router();
const dotenv = require('dotenv').config()
const adminKey = process.env.ADMIN_KEY;
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

import makeInvite from '../Utils/makeInvite';

router.post('/makeInvite', multipartMiddleware, async function (req: Request, res: Response) {



    const sentKey = req.body.key as string;


    if (sentKey !== adminKey) {
        res.status(401).json({
            success: false,
            error: 'Invalid key'
        });
        return;
    }

    const invite = makeInvite();

    const insertInvite = await prisma.invites.create({
        data: {
            code: invite
        }
    });



    res.status(200).json({
        success: true,
        invite
    });









});


export default router;