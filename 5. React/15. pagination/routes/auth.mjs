
import express from 'express';
let router = express.Router()
import { client } from './../mongodb.mjs'
import jwt from 'jsonwebtoken';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import postmark from 'postmark'
import useragent from 'useragent'; // You may need to install this package using: npm install useragent

import {
    stringToHash,
    verifyHash,
    varifyHash
} from "bcrypt-inzi";

const userCollection = client.db("cruddb").collection("users");
const otpCollection = client.db("cruddb").collection("otpCodes");



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


                const agent = useragent.parse(req.get('User-Agent'));

                const emailMessage = `
                        Login Alert:
                        email: ${req.body.email}
                        Browser: ${agent.toAgent()}
                        OS: ${agent.os.toString()}
                        Device: ${agent.device.toString()}
                        IP Address: ${req.ip}
                        Timestamp: ${new Date().toLocaleString()}
                    `;


                console.log(emailMessage);


                // Send an email:
                const POSTMARK_TOKEN="your postmark token";
                const client = new postmark.ServerClient(POSTMARK_TOKEN);


                client.sendEmail({
                    "From": "no-reply@yourverifiedsign.com",
                    "To": req.body.email,
                    "Subject": "your app name - Login Alert",
                    "TextBody": emailMessage
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

        const otpCode = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });

        console.log("otpCode: ", otpCode);

        // postmarkClient.send({
        //     from: "no-reply@aicarz.com",
        //     to: user.email,
        //     text: `Hi ${ user.firstName } !here is your forget password
        //     otp code, this is valid for 15 minutes: ${otpCode}`
        // })



        const otpCodeHash = await stringToHash(otpCode);

        const insertResponse = await otpCollection.insertOne({
            email: req.body.email,
            otpCodeHash: otpCodeHash,
            createdOn: new Date()
        });
        console.log("insertResponse: ", insertResponse);

        res.send({ message: 'Forget password otp send' });

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})

router.post('/forget-password-complete', async (req, res, next) => {

    if (!req.body?.email
        || !req.body.otpCode
        || !req.body.newPassword) {

        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            email: "some@email.com",
            otpCode: "344532",
        } `);
        return;
    }

    req.body.email = req.body.email.toLowerCase();

    try {
        const otpRecord = await otpCollection.findOne(
            { email: req.body.email },
            { sort: { _id: -1 } }
        )
        console.log("otpRecord: ", otpRecord);

        if (!otpRecord) { // user not found
            res.status(403).send({
                message: "invalid otp"
            });
            return;
        }

        const isOtpValid = await verifyHash(req.body.otpCode, otpRecord.otpCodeHash);

        if (!isOtpValid) {
            res.status(403).send({
                message: "invalid otp"
            });
            return;
        }

        if (moment().diff(moment(otpRecord.createdOn), 'minutes') >= 15) {
            res.status(403).send({
                message: "invalid otp"
            });
            return;
        }

        const passwordHash = await stringToHash(req.body.newPassword);

        const updateResp = await userCollection.updateOne(
            { email: otpRecord.email },
            {
                $set: { password: passwordHash }
            });
        console.log("updateResp: ", updateResp);


        res.send({ message: 'Forget password completed, proceed to login with new password' });

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }
})




export default router

