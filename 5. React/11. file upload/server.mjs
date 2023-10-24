import express from 'express';
import cors from 'cors';
import path from 'path';
const __dirname = path.resolve();
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';

import { client } from './mongodb.mjs'
import { ObjectId } from 'mongodb'

const db = client.db("cruddb");
const col = db.collection("posts");
const userCollection = db.collection("users");


import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'
import commentRouter from './routes/comment.mjs'
import feedRouter from './routes/feed.mjs'
import unAuthProfileRouter from './unAuthRoutes/profile.mjs'


const app = express();
app.use(express.json()); // body parser
app.use(cookieParser()); // cookie parser
app.use(cors({
    origin: ['http://localhost:3000'],
    credentials: true
}));


app.use("/api/v1", authRouter)

app.use("/api/v1", (req, res, next) => { // JWT
    console.log("cookies: ", req.cookies);

    const token = req.cookies.token;
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log("decoded: ", decoded);

        req.body.decoded = {
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            email: decoded.email,
            isAdmin: decoded.isAdmin,
            _id: decoded._id,
        };

        next();

    } catch (err) {

        unAuthProfileRouter(req, res)
        return;
    }
})

app.use("/api/v1", postRouter) // Secure api


app.use("/api/v1/ping", (req, res) => {
    res.send("OK");
})



app.use('/', express.static(path.join(__dirname, 'web/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/build/index.html'))
    // res.redirect('/');
})


const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Example server listening on port ${PORT}`)
})
