import express from 'express';
let router = express.Router()


import authRouter from './routes/auth.mjs'
import commentRouter from './routes/comment.mjs'
import feedRouter from './routes/feed.mjs'
import postRouter from './routes/post.mjs'


// /api/v1/login
router.use(authRouter)


router.use((req, res, next) => {
    const token = "valid";
    if (token === "valid") {
        next();
    } else {
        res.send({ message: "invalid token" })
    }
})

router.use(commentRouter)
router.use(postRouter)
router.use(feedRouter)


router.post("/weather", (req, res, next) => {

    console.log("req.body: ", req.body);


    // res.send("weather is normal"); // not recommended

    res.send({
        message: "weather is normal",
        apiVersion: "v1",
        temp: 32,
        min: 20,
    });
})

export default router