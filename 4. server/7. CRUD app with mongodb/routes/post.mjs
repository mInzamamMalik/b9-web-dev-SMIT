
import express from 'express';
import { nanoid } from 'nanoid'
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
router.post('/post', (req, res, next) => {
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

    posts.unshift({
        id: nanoid(),
        title: req.body.title,
        text: req.body.text,
    })

    res.send('post created');
})
// GET     /api/v1/posts
router.get('/posts', (req, res, next) => {
    console.log('this is signup!', new Date());
    res.send(posts);
})

// GET     /api/v1/post/:postId
router.get('/post/:postId', (req, res, next) => {
    console.log('this is signup!', new Date());

    if (req.params.postId) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

    for (let i = 0; i < posts.length; i++) {
        if (posts[i].id === req.params.postId) {
            res.send(posts[i]);
            return;
        }
    }
    res.send('post not found with id ' + req.params.postId);
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