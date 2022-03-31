var express = require('express');
var app = express();
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
var port = 3000;
var validator = require("email-validator");
import axios from 'axios';
import * as helmet from 'helmet';
const cors = require('cors');

const dotenv = require('dotenv').config();

import AdminRouter from './Routers/AdminRouter';

const token = process.env.TOKEN;
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()




const domains = ["@radiant.cool", "@shiba.bar", "@floppa.email", "@catgirls.work", "@otters.shop", "@webmail.surf", "@skeeet.cc", "@catgirls.digital", "@bigfloppa.monster", "@lean.monster ", "@cope.wtf", "@hypixel.pro", "@my-balls-it.ch", "@allah.agency", "@thighs.media", "@monke.party", "@femboy.media", "@floppa-is.art", "@floppa.company", "@floppa.digital", "@fortnite.bar", "@fakenitro.store", "@crisium.one", "@shibeclub.tech", "@shibe-in.space", "@lunarclient.site", "@cock.red", "@indianscammer.email", "@badlionclient.info", "@fart.host", "@grabify.website", "@scamming.email", "@femboys.email", "@rapist.email", "@ching-chong-wing.wang", "@e-z.email"]
app.use(helmet.noSniff())
app.use(helmet.xssFilter())

app.use(
    cors({
        credentials: true,
        origin: [
            'https://www.radiant.cool',
            'https://radiant.cool',
            'http://localhost:3000',
            'http://localhost:3001',
            'https://api.radiant.cool',
        ],
    })
);

app.options('*', cors({
    credentials: true,
    origin: [
        'https://www.radiant.cool',
        'https://radiant.cool',
        'http://localhost:3000',
        'http://localhost:3001',
        'https://api.radiant.cool',
    ],
}));





app.use('/admin', AdminRouter)

app.set('x-powered-by', 'radiant.cool');











app.post('/register', multipartMiddleware, async function (req: any, res: any) {



    const password = req.body.password as string;
    const email = req.body.email as string;
    const domain = req.body.domain as string;
    const invite = req.body.invite as string;

    const findInvite = await prisma.invites.findFirst({
        where: {
            code: invite
        }
    });

    if (!findInvite) {
        res.status(401).json({
            success: false,
            error: 'Invalid invite'
        });
        return;
    }

    const deleteInvite = await prisma.invites.delete({
        where: {
            code: invite
        }
    });

    if (!deleteInvite) {
        res.status(401).json({
            success: false,
            error: 'Invalid invite'
        });
        return;
    }








    if (!password || !email || !domain || !invite) {
        res.status(400).json({
            success: false,
            error: 'Missing fields'
        });
        return;
    }

    if (!domains.includes(domain)) {
        res.status(400).json({
            success: false,
            error: 'Invalid domain'
        });
        return;
    }


    const fullEmail = email + domain;

    if (!validator.validate(fullEmail)) {
        res.status(400).json({
            success: false,
            error: 'Invalid email'
        });
        return;
    }


    const data = new URLSearchParams();
    data.append('email', fullEmail);
    data.append('password', password);


    const resp = await axios(`https://mail.radiant.cool/admin/mail/users/add`, { method: 'POST', data, headers: { 'Authorization': `Basic ${token}` } });
    if (resp.status === 200 && resp.statusText === 'OK') {
        res.status(200).json({
            success: true,
            message: 'User created'
        });
    } else {
        res.status(400).json({
            success: false,
            error: resp.data
        });
    }



});








app.listen(port, function () {
    console.log('api.radiant.cool listening on port ' + port);
}
);

