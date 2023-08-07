
import express from 'express';
let router = express.Router()
import { client } from './../mongodb.mjs'

const userCollection = client.db("cruddb").collection("users");

router.post('/login', (req, res, next) => {
    console.log('this is login!', new Date());
    res.send('this is login v1' + new Date());
})
router.post('/signup', async (req, res, next) => {

    if (
        !req.body?.firstName
        || !req.body?.LastName // family name, sur name
        || !req.body?.email
        || !req.body?.password
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            firstName: "some firstName",
            LastName: "some LastName",
            email: "some@email.com",
            password: "some$password",
        } `);
        return;
    }

    req.body.email = req.body.email.toLowerCase();


    try {
        let result = await userCollection.findOne({ email: req.body.email });
        console.log("result: ", result);

        if (!result) { // user not found

            const insertResponse = await userCollection.insertOne({
                firstName: req.body.firstName,
                LastName: req.body.LastName,
                email: req.body.email,
                password: req.body.password, // TODO: convert password into hash
                createdOn: new Date()
            });
            console.log("insertResponse: ", insertResponse);

            res.send({ message: 'Signup successful' });

        } else { // user already exists
            res.status(403).send({
                message: "user already exist with this email",
                abc: "user already exist with this email"
            });
        }

    } catch (e) {
        console.log("error getting data mongodb: ", e);
        res.status(500).send('server error, please try later');
    }








})


export default router

