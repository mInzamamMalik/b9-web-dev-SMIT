import express from 'express';
import cors from 'cors';
import path from 'path';
import 'dotenv/config';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb'
import { createServer } from "http";
import { Server as socketIo } from 'socket.io';



import { client } from './mongodb.mjs'
import authRouter from './routes/auth.mjs'
import postRouter from './routes/post.mjs'
import chatRouter from './routes/chat.mjs'
import commentRouter from './routes/comment.mjs'
import feedRouter from './routes/feed.mjs'
import unAuthProfileRouter from './unAuthRoutes/profile.mjs'
import { globalIoObject  } from './core.mjs'

const db = client.db("cruddb");
const col = db.collection("posts");
const userCollection = db.collection("users");
const __dirname = path.resolve();



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

        req.currentUser = {
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
app.use("/api/v1", chatRouter) // Secure api


app.use("/api/v1/ping", (req, res) => {
    res.send("OK");
})



app.use('/', express.static(path.join(__dirname, 'web/build')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/web/build/index.html'))
    // res.redirect('/');
})

// THIS IS THE ACTUAL SERVER WHICH IS RUNNING
const server = createServer(app);

// handing over server access to socket.io
const io = new socketIo(server, { cors: { origin: "*", methods: "*", } });
globalIoObject.io = io;

io.on("connection", (socket) => {
    console.log("New client connected with id: ", socket.id);
})

// setInterval(() => {
//     io.emit(
//         "channel1",
//         `some data => ${new Date().toLocaleString()}`
//     )
// }, 1000);

const PORT = process.env.PORT || 5002;
server.listen(PORT, function () {
    console.log("server is running on", PORT);
})