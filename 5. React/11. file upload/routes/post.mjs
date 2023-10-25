
import express from 'express';
import { nanoid } from 'nanoid'
import { client } from './../mongodb.mjs'
import { ObjectId } from 'mongodb'
import OpenAI from "openai";
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";

const db = client.db("cruddb");
const col = db.collection("posts");
const userCollection = db.collection("users");

//==============================================
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './uploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//==============================================



// https://firebase.google.com/docs/storage/admin/start
let serviceAccount = {
    "type": "service_account",
    "project_id": "smit-b9",
    "private_key_id": "c3720670cec6ca23092087aa8991f3216dd37033",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDBl9xHgdNiejU\n0RytstY2kLHgG81pcQ6TQ5oYAvrjtQtcNhvLCjAi5mevTzhiPkbeomE9aGEkcu/y\nmemNNA5MM5DsHwCK6Z4DdX+QtnjMCF4pk4Vx4opND5GWG2BLTJ+T/gAYqaupGFqG\nQB8bGKIu3kkiUGzmztEPC+gSkdt5y7W+8WXLyY7mCTGfMFnbd7B9PXQMeQmrSek+\nobbW00n6NlKQLJi9OJov8L7HeK3FTFccSnW3vXLlG11jJw8E/mbHFAiI1q/i/RQ6\nwuUSn2qZUnE1pohSlJnHvyESvCaUaw1Qcu/cA/eBrnN14rKPiuUpGFJ0lIOXwwLy\nDwYnjWbXAgMBAAECggEAVHD18ixmTRRhU4QXPr4oMggEfFyNXBIvlWO33J2ts9o3\nyP1Em20V2oaYbjeG2kLMvKjiIYyIQxfg/NHXZeQcLLJHFXV27q6oVCcTzLy1IOKe\norHVHbJQ33zWNIA1+WR708Aumn8cbGK3D1nEHh9UWaa1U74u6OCzdChbm2678MeZ\nGCLBf8wA/6sWcJXq9hfaoj2CWcR3mb4TOMVXbnpeiuJvSZxpcq5RdQxkv/hvbF98\nT3mW9c5fIcZm2Bc8k/OnC33nQ498sO7bgATDUmJj2gOGMf+4rj7HSb+nmRcqyfYY\nG316KIkATwMTBg3otW/Dlinq3qO02YO28reOc6lWgQKBgQDx2jS91K/5mPRcFHwZ\n82GSclhY3IbFkNDQU+NF3036U8oU1vomxuwSka9bJZWM+lvCwlBXsvR818x22/3m\nhAHjpjjgcA1PpGeaw9gxYIzlcjVj4IZuM6WbTlL39W8ciR1dNirDH8Uk5JBWYHoi\nPv9RXTzmDj1gszoCAozJWrSJyQKBgQDObuou1bS/2bYD2BttDRYJ4yA/R9i0RwZw\n1bx9oo5cFrdas2PIy5MBj7IbtUFR+Memnuv8PzKULuQmak8B3LePMGakukAZcDUV\nJzwVbSrJUTJE7bgl1NDrfOV47oslUMx6dp0k9WDhjbbQkcFZN0e5j9TGLcThh0gd\nh88FDZa7nwKBgGWGOvOhL8nwKkvpEXt3TnNCatHKqQyQUQfS3yn6pmo5+C+tWs8i\nXAEjhOAXM+M9SX3FQiK+baFmmV8f1EKLEZv1sBSPFRdkpVUzdzKrHBpJSh5GJ0hl\nh9RdGbkbH2x0Jo51aZgFYyWsiOapkzuDBHysTh8oxR0tv2EOnvj7iaP5AoGAWenD\nhIy+goWQGtKI95GolLvhss5XXAZHjuP5intAKGoYiJ/0CWRp7lcpS5pCDjMeursj\nrCXWoOZfpz/Mk9IP/YUmX/9jpfDSnhkNuYNoDHGaRJ2KBKhSKw+mX2r/Hky4E2sQ\nfSWHghaYlvW1UmeajP9RvNP4mgazaXFawSevDJ8CgYAAzWzp88KLWw3buujKsFJQ\nGcR7iwHosjd79ZlrtmwXGAqHrpHbxs4jvafqRJrIwYRbd1cW4u98HXZS9W4oXsR3\nD4VQ4uiduebFHluNPCBcB8zRQku5mHBV616vzRbFLSiZ/LJ7HBFznYPeTK7qzsn2\nn+cBOJ118AP7xFDX2sSwBQ==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-exepd@smit-b9.iam.gserviceaccount.com",
    "client_id": "104671436353117487920",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-exepd%40smit-b9.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
};
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://smit-b9.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://smit-b9.appspot.com");

//==============================================




let router = express.Router()

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});




// https://baseurl.com/search?q=car
router.get('/search', async (req, res, next) => {

    try {
        const response = await openaiClient.embeddings.create({
            model: "text-embedding-ada-002",
            input: req.query.q,
        });
        const vector = response?.data[0]?.embedding
        console.log("vector: ", vector);
        // [ 0.0023063174, -0.009358601, 0.01578391, ... , 0.01678391, ]

        // Query for similar documents.
        const documents = await col.aggregate([
            {
                "$search": {
                    "index": "vectorIndex",
                    "knnBeta": {
                        "vector": vector,
                        "path": "embedding",
                        "k": 10 // number of documents
                    },
                    "scoreDetails": true

                }
            },
            {
                "$project": {
                    "embedding": 0,
                    "score": { "$meta": "searchScore" },
                    "scoreDetails": { "$meta": "searchScoreDetails" }
                }
            }
        ]).toArray();

        documents.map(eachMatch => {
            console.log(`score ${eachMatch?.score?.toFixed(3)} => ${JSON.stringify(eachMatch)}\n\n`);
        })
        console.log(`${documents.length} records found `);

        res.send(documents);

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }

})


// POST    /api/v1/post
router.post('/post',
    (req, res, next) => {
        req.decoded = { ...req.body.decoded }
        next();
    },
    upload.any(),

    async (req, res, next) => {
        console.log("req.body: ", req.body);

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


        // TODO: save file in storage bucket and get public url

        console.log("req.files: ", req.files);

        if (req.files[0].size > 2000000) { // size bytes, limit of 2MB
            res.status(403).send({ message: 'File size limit exceed, max limit 2MB' });
            return;
        }

        bucket.upload(
            req.files[0].path,
            {
                destination: `profile/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // console.log("api resp: ", apiResponse);

                    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 


                            try {
                                const insertResponse = await col.insertOne({
                                    // _id: "7864972364724b4h2b4jhgh42",
                                    title: req.body.title,
                                    text: req.body.text,
                                    img: urlData[0],
                                    authorEmail: req.decoded.email,
                                    authorId: new ObjectId(req.decoded._id),
                                    createdOn: new Date()
                                });
                                console.log("insertResponse: ", insertResponse);

                                res.send({ message: 'post created' });
                            } catch (e) {
                                console.log("error inserting mongodb: ", e);
                                res.status(500).send({ message: 'server error, please try later' });
                            }



                            // // delete file from folder before sending response back to client (optional but recommended)
                            // // optional because it is gonna delete automatically sooner or later
                            // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send({
                        message: "server error"
                    });
                }
            });




    })



router.get('/feed', async (req, res, next) => {

    // const cursor = col.find({})
    //     .sort({ _id: -1 })
    //     .limit(100)
    //     .project({ embedding: 0 })

    const cursor = col.aggregate([
        {
            $lookup: {
                from: "users", // users collection name
                localField: 'authorId',
                foreignField: '_id',
                as: 'authorObject'
            },
        },
        {
            $unwind: {
                path: '$authorObject',
                preserveNullAndEmptyArrays: true, // Include documents with null authorId
            },
        },
        {
            $project: {
                _id: 1,
                text: 1,
                title: 1,
                img: 1,
                createdOn: 1,
                likes: { $ifNull: ['$likes', []] },
                authorObject: {
                    firstName: '$authorObject.firstName',
                    lastName: '$authorObject.lastName',
                    email: '$authorObject.email'
                }
            },
        },
        {
            $sort: { _id: -1 }
        },
        {
            $skip: 0
        },
        {
            $limit: 100,
        }

    ])


    try {
        let results = await cursor.toArray()
        // console.log("results: ", results);
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }

})

// /post?_id=23454354353453
router.get('/posts', async (req, res, next) => {

    const userId = req.query._id || req.body.decoded._id

    if (!ObjectId.isValid(userId)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    const cursor = col.find({ authorId: new ObjectId(userId) })
        .sort({ _id: -1 })
        .limit(100);

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

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }


    // const cursor = col.find({ price: { $lte: 77 } });
    // const cursor = col.find({
    //     $or: [
    //         { _id: req.params.postId },
    //         { title: "dfsdf sdfsdf" }
    //     ]
    // })


    try {
        let result = await col.findOne({ _id: new ObjectId(req.params.postId) });
        console.log("result: ", result); // [{...}] []
        res.send(result);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

const getProfileMiddleware = async (req, res, next) => {

    const userId = req.params.userId || req.body.decoded._id;

    if (!ObjectId.isValid(userId)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {
        let result = await userCollection.findOne({ _id: new ObjectId(userId) });
        console.log("result: ", result); // [{...}] []
        res.send({
            message: 'profile fetched',
            data: {
                isAdmin: result?.isAdmin,
                firstName: result?.firstName,
                lastName: result?.lastName,
                email: result?.email,
                _id: result?._id
            }
        });
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
}
router.get('/profile', getProfileMiddleware)
router.get('/profile/:userId', getProfileMiddleware)


// PUT     /api/v1/post/:postId
// {
//     title: "updated title",
//     text: "updated text"
// }

router.put('/post/:postId', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    if (!req.body.text
        && !req.body.title) {
        res.status(403).send(`required parameter missing, atleast one key is required.
        example put body: 
        PUT     /api/v1/post/:postId
        {
            title: "updated title",
            text: "updated text"
        }
        `)
    }

    let dataToBeUpdated = {};

    if (req.body.title) { dataToBeUpdated.title = req.body.title }
    if (req.body.text) { dataToBeUpdated.text = req.body.text }


    try {
        const updateResponse = await col.updateOne(
            {
                _id: new ObjectId(req.params.postId)
            },
            {
                $set: dataToBeUpdated
            });
        console.log("updateResponse: ", updateResponse);

        res.send('post updated');
    } catch (e) {
        console.log("error inserting mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

// DELETE  /api/v1/post/:postId
router.delete('/post/:postId', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    try {
        const deleteResponse = await col.deleteOne({ _id: new ObjectId(req.params.postId) });
        console.log("deleteResponse: ", deleteResponse);
        res.send('post deleted');
    } catch (e) {
        console.log("error deleting mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.post('/post/:postId/dolike', async (req, res, next) => {

    if (!ObjectId.isValid(req.params.postId)) {
        res.status(403).send(`Invalid post id`);
        return;
    }

    try {
        const doLikeResponse = await col.updateOne(
            { _id: new ObjectId(req.params.postId) },
            {
                $addToSet: {
                    likes: new ObjectId(req.body.decoded._id)
                }
            }
        );
        console.log("doLikeResponse: ", doLikeResponse);
        res.send('like done');
    } catch (e) {
        console.log("error like post mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

export default router


