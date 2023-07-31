
import express from 'express';
import { nanoid } from 'nanoid'
import { client } from './../mongodb.mjs'
import { ObjectId } from 'mongodb'

const db = client.db("cruddb");
const col = db.collection("posts");

let router = express.Router()

// not recommended at all - server should be stateless
let posts = [
    {
        id: nanoid(),
        title: "abc post title",
        text: "some post text"
    }
]

// POST    /api/v1/post
router.post('/post', async (req, res, next) => {
    console.log('this is signup!', new Date());

    if (
        !req.body.title
        || !req.body.text
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    try {
        const insertResponse = await col.insertOne({
            // _id: "7864972364724b4h2b4jhgh42",
            id: nanoid(),
            title: req.body.title,
            text: req.body.text,
        });
        console.log("insertResponse: ", insertResponse);

        res.send('post created');
    } catch (e) {
        console.log("error inserting mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})


router.get('/posts', async (req, res, next) => {

    const cursor = col.find({});
    try {
        let results = await cursor.toArray()
        console.log("results: ", results);
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})


// [92133,92254, 92255 ]

router.get('/post/:postId', async (req, res, next) => {
    console.log('this is signup!', new Date());

    if (!req.params.postId) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

    const cursor = col.find({ _id: new ObjectId(req.params.postId) });

    // const cursor = col.find({ price: { $lte: 77 } });
    // const cursor = col.find({
    //     $or: [
    //         { _id: req.params.postId },
    //         { title: "dfsdf sdfsdf" }
    //     ]
    // })


    try {
        let results = await cursor.toArray()
        console.log("results: ", results); // [{...}] []
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

// PUT     /api/v1/post/:userId/:postId
// {
//     title: "updated title",
//     text: "updated text"
// }

router.put('/post/:postId', (req, res, next) => {

    if (!req.params.postId
        || !req.body.text
        || !req.body.title) {
        res.status(403).send(`example put body: 
        PUT     /api/v1/post/:postId
        {
            title: "updated title",
            text: "updated text"
        }
        `)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            posts[i] = {
                text: req.body.text,
                title: req.body.title,
            }
            res.send('post updated with id ' + req.params.postId);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
})

// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/:postId', (req, res, next) => {

    if (!req.params.postId) {
        res.status(403).send(`post id must be a valid id`)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            posts.splice(i, 1)
            res.send('post deleted with id ' + req.params.postId);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
})

export default router


