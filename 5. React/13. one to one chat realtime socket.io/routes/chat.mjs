
import express from 'express';
import { nanoid } from 'nanoid'
import { client } from './../mongodb.mjs'
import { ObjectId } from 'mongodb'
import OpenAI from "openai";
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";


const db = client.db("cruddb");
const messagesCollection = db.collection("messages");
const col = db.collection("posts");
const userCollection = db.collection("users");
import { globalIoObject } from '../core.mjs';

// // https://firebase.google.com/docs/storage/admin/start
// let serviceAccount = {
//     "type": "service_account",
//     "project_id": "smit-b9",
//     "private_key_id": "c3720670cec6ca23092087aa8991f3216dd37033",
//     "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDDBl9xHgdNiejU\n0RytstY2kLHgG81pcQ6TQ5oYAvrjtQtcNhvLCjAi5mevTzhiPkbeomE9aGEkcu/y\nmemNNA5MM5DsHwCK6Z4DdX+QtnjMCF4pk4Vx4opND5GWG2BLTJ+T/gAYqaupGFqG\nQB8bGKIu3kkiUGzmztEPC+gSkdt5y7W+8WXLyY7mCTGfMFnbd7B9PXQMeQmrSek+\nobbW00n6NlKQLJi9OJov8L7HeK3FTFccSnW3vXLlG11jJw8E/mbHFAiI1q/i/RQ6\nwuUSn2qZUnE1pohSlJnHvyESvCaUaw1Qcu/cA/eBrnN14rKPiuUpGFJ0lIOXwwLy\nDwYnjWbXAgMBAAECggEAVHD18ixmTRRhU4QXPr4oMggEfFyNXBIvlWO33J2ts9o3\nyP1Em20V2oaYbjeG2kLMvKjiIYyIQxfg/NHXZeQcLLJHFXV27q6oVCcTzLy1IOKe\norHVHbJQ33zWNIA1+WR708Aumn8cbGK3D1nEHh9UWaa1U74u6OCzdChbm2678MeZ\nGCLBf8wA/6sWcJXq9hfaoj2CWcR3mb4TOMVXbnpeiuJvSZxpcq5RdQxkv/hvbF98\nT3mW9c5fIcZm2Bc8k/OnC33nQ498sO7bgATDUmJj2gOGMf+4rj7HSb+nmRcqyfYY\nG316KIkATwMTBg3otW/Dlinq3qO02YO28reOc6lWgQKBgQDx2jS91K/5mPRcFHwZ\n82GSclhY3IbFkNDQU+NF3036U8oU1vomxuwSka9bJZWM+lvCwlBXsvR818x22/3m\nhAHjpjjgcA1PpGeaw9gxYIzlcjVj4IZuM6WbTlL39W8ciR1dNirDH8Uk5JBWYHoi\nPv9RXTzmDj1gszoCAozJWrSJyQKBgQDObuou1bS/2bYD2BttDRYJ4yA/R9i0RwZw\n1bx9oo5cFrdas2PIy5MBj7IbtUFR+Memnuv8PzKULuQmak8B3LePMGakukAZcDUV\nJzwVbSrJUTJE7bgl1NDrfOV47oslUMx6dp0k9WDhjbbQkcFZN0e5j9TGLcThh0gd\nh88FDZa7nwKBgGWGOvOhL8nwKkvpEXt3TnNCatHKqQyQUQfS3yn6pmo5+C+tWs8i\nXAEjhOAXM+M9SX3FQiK+baFmmV8f1EKLEZv1sBSPFRdkpVUzdzKrHBpJSh5GJ0hl\nh9RdGbkbH2x0Jo51aZgFYyWsiOapkzuDBHysTh8oxR0tv2EOnvj7iaP5AoGAWenD\nhIy+goWQGtKI95GolLvhss5XXAZHjuP5intAKGoYiJ/0CWRp7lcpS5pCDjMeursj\nrCXWoOZfpz/Mk9IP/YUmX/9jpfDSnhkNuYNoDHGaRJ2KBKhSKw+mX2r/Hky4E2sQ\nfSWHghaYlvW1UmeajP9RvNP4mgazaXFawSevDJ8CgYAAzWzp88KLWw3buujKsFJQ\nGcR7iwHosjd79ZlrtmwXGAqHrpHbxs4jvafqRJrIwYRbd1cW4u98HXZS9W4oXsR3\nD4VQ4uiduebFHluNPCBcB8zRQku5mHBV616vzRbFLSiZ/LJ7HBFznYPeTK7qzsn2\nn+cBOJ118AP7xFDX2sSwBQ==\n-----END PRIVATE KEY-----\n",
//     "client_email": "firebase-adminsdk-exepd@smit-b9.iam.gserviceaccount.com",
//     "client_id": "104671436353117487920",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-exepd%40smit-b9.iam.gserviceaccount.com",
//     "universe_domain": "googleapis.com"
// };
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     // databaseURL: "https://smit-b9.firebaseio.com"
// });
// const bucket = admin.storage().bucket("gs://smit-b9.appspot.com");

// //==============================================




let router = express.Router()

const openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});


router.post("/message", multer().none(), async (req, res, next) => {

    console.log("req.body: ", req.body);
    console.log("req.currentUser: ", req.currentUser);

    if (!req.body.to_id || !req.body.messageText) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            to_id: "43532452453565645635345",
            messageText: "some post text"
        } `);
        return; ``
    }

    if (!ObjectId.isValid(req.body.to_id)) {
        res.status(403).send(`Invalid user id`);
        return;
    }

    try {

        const newMessage = {
            fromName: req.currentUser.firstName + " " + req.currentUser.lastName,
            fromEamil: req.currentUser.email, // malik@abc.com
            from_id: new ObjectId(req.currentUser._id), // 245523423423424234

            to_id: new ObjectId(req.body.to_id),

            messageText: req.body.messageText,
            imgUrl: req.body.imgUrl,
            createdOn: new Date()
        }

        const insertResponse = await messagesCollection.insertOne(newMessage);
        console.log("insertResponse: ", insertResponse);

        newMessage._id = insertResponse.insertedId;

        if (globalIoObject.io) {
            console.log(`emiting message to ${req.body.to_id}`);
            globalIoObject.io.emit(req.body.to_id, newMessage);

            globalIoObject.io.emit(
                `notification-${req.body.to_id}`,
                `new message from ${req.currentUser.firstName}: ${req.body.messageText}`
            );


        }

        res.send({ message: 'message sent' });
    } catch (e) {
        console.log("error sending message mongodb: ", e);
        res.status(500).send({ message: 'server error, please try later' });
    }


});

router.get("/messages/:from_id", async (req, res, next) => {

    if (!req.params.from_id) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            from_id: "43532452453565645635345"
        } `);
    }

    if (!ObjectId.isValid(req.params.from_id)) {
        res.status(403).send(`Invalid user id`);
        return;
    }


    const cursor = messagesCollection.find({
        $or: [
            {
                to_id: new ObjectId(req.currentUser._id),
                from_id: new ObjectId(req.params.from_id),
            }
            ,
            {
                from_id: new ObjectId(req.currentUser._id),
                to_id: new ObjectId(req.params.from_id)
            }
        ]
    })

        .sort({ _id: -1 })
        .limit(100);

    try {
        let results = await cursor.toArray()
        // console.log("results: ", results);
        res.send(results);
    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }





});





export default router


