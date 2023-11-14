
import express from 'express';
let router = express.Router()
import { client } from './../mongodb.mjs'
import jwt from 'jsonwebtoken';
import {
    stringToHash,
    varifyHash
} from "bcrypt-inzi";

const userCollection = client.db("cruddb").collection("users");



router.post('/login', async (req, res, next) => {

    if (
        !req.body?.email
        || !req.body?.password
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            email: "some@email.com",
            password: "some$password",
        } `);
        return;
    }
    req.body.email = req.body.email.toLowerCase();

    try {
        let result = await userCollection.findOne({ email: req.body.email });
        // console.log("result: ", result);

        if (!result) { // user not found
            res.status(403).send({
                message: "email or password incorrect"
            });
            return;
        } else { // user found


            const isMatch = await varifyHash(req.body.password, result.password)

            if (isMatch) {

                const token = jwt.sign({
                    isAdmin: result.isAdmin,
                    firstName: result.firstName,
                    lastName: result.lastName,
                    email: req.body.email,
                    _id: result._id
                }, process.env.SECRET, {
                    expiresIn: '24h'
                });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    expires: new Date(Date.now() + 86400000)
                });

                res.send({
                    message: "login successful",
                    data: {
                        isAdmin: result.isAdmin,
                        firstName: result.firstName,
                        lastName: result.lastName,
                        email: req.body.email,
                        _id: result._id
                    }
                });
                return;
            } else {
                res.status(401).send({
                    message: "email or password incorrect"
                })
                return;
            }
        }

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.post('/logout', async (req, res, next) => {

    // res.cookie('token', '', {
    //     httpOnly: true,
    //     secure: true,
    //     expires: new Date(Date.now() + 86400000)
    // });

    res.clearCookie('token');
    res.send({ message: 'logout successful' });
})

router.post('/signup', async (req, res, next) => {

    if (
        !req.body?.firstName
        || !req.body?.lastName // family name, sur name
        || !req.body?.email
        || !req.body?.password
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            firstName: "some firstName",
            lastName: "some lastName",
            email: "some@email.com",
            password: "some$password",
        } `);
        return;
    }

    req.body.email = req.body.email.toLowerCase();
    // TODO: validate email


    try {
        let result = await userCollection.findOne({ email: req.body.email });
        // console.log("result: ", result);

        if (!result) { // user not found

            const passwordHash = await stringToHash(req.body.password);

            const insertResponse = await userCollection.insertOne({
                isAdmin: false,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: passwordHash,
                createdOn: new Date()
            });
            console.log("insertResponse: ", insertResponse);

            res.send({ message: 'Signup successful' });

        } else { // user already exists
            res.status(403).send({
                message: "user already exist with this email"
            });
        }

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.post('/forget-password', async (req, res, next) => {

    if (!req.body?.email) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            email: "some@email.com"
        } `);
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    try {
        const user = await userCollection.findOne({ email: req.body.email });
        // console.log("user: ", user);

        if (!user) { // user not found
            res.status(403).send({
                message: "user not found"
            });
            return;
        }

        

        

        const passwordHash = await stringToHash(req.body.password);

        const insertResponse = await userCollection.insertOne({
            isAdmin: false,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: passwordHash,
            createdOn: new Date()
        });
        console.log("insertResponse: ", insertResponse);

        res.send({ message: 'Signup successful' });

    } else { // user already exists
        res.status(403).send({
            message: "user already exist with this email"
        });
    }

} catch (e) {
    console.log("error getting data mongodb: ", e);
    res.status(500).send('server error, please try later');
}
})




export default router

