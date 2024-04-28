require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const {dbClient, mongodbUri} = require("./database/mongodb-client");
const jobModel = require('./models/job-model');
const jobController = require('./controllers/job-controller');
const { ObjectId } = require('mongodb');
const mongoose = require("mongoose");
const UserController = require('./controllers/user-controller');


// middleware

app.use(express.json())
app.use(cors())


//user: begmatovsultanbek
//password: 5y8wEJtUpi9RIBiU



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await dbClient.connect();
        await mongoose.connect(mongodbUri);

        // post a job
        app.post("/post-job", async (req, res) => {
            const body = req.body;
            body.createAt = new Date();
            console.log("Added job", body)
            const result = await jobModel.insertOne(body);
            if (result.insertedId) {
                return res.status(200).send(result);
            } else {
                return res.status(404).send({
                    message: "can not insert! try again later",
                    status: false

                })
            }

        })

        app.post("/job/apply/:jobId", async (req, res) => {
            try {
                await jobController.apply({
                    jobId: req.params.jobId,
                    linkToResume: req.body.linkToResume
                })

                res.status(200).json({
                    success: true,
                    message: "Application was sent successfully"
                })

                return
            }
            catch (error) {
                res.status(200).json({
                    success: false,
                    message: error?.message || error
                })             
            }
        })

        app.post("/user/login-with-google", async (req, res) => {
            const result = await UserController.singUpWithGoogle({
                username: req.body.username,
                fullName: req.body.full_name,
                accessToken: req.body.access_token,
                type: req.body.type
            })

            res.status(200).json({
                success: true,
                message: "",
                data: {
                    access_token: result.accessToken
                }
            })
        })

        app.post("/user/get-me", async (req, res) => {
            const result = await UserController.getByAccessToken({
                accessToken: req.body.access_token
            })


            if(!result) {
                res.status(200).json({
                    success: false,
                    message: "User is not registered"
                })

                return
            }

            res.status(200).json({
                success: true,
                message: "",
                data: {
                    id: result.id,
                    email: result.email,
                    full_name: result.fullName,
                    type: result.type,
                }
            })
        })


        // get all jobs

        app.get("/all-jobs", async (req, res) => {
            const jobs = await jobModel.find({}).toArray()
            res.send(jobs);
        })

        // update job and get single job using id

        app.get("/all-jobs/:id", async(req, res) => {
            const id = req.params.id;
            const job = await jobModel.findOne({_id: new ObjectId(id)})
            res.send(job)
        })

        // get jobs by email

        app.get("/myJobs/:email", async(req, res)=> {
            //console.log(req.params.email)
            const jobs = await jobModel.find({postedBy: req.params.email}).toArray();
            res.json(jobs)
        })


        // delete job

        app.delete("/job/:id", async(req, res) => {
            const id = req.params.id;
            const filter = {_id: new ObjectId(id)}
            const result = await jobModel.deleteOne(filter);
            res.send(result)
        })


        //update job

        app.patch("/update-job/:id", async(req, res) => {
            const id = req.params.id;
            const jobData = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updateDoc = {
                $set: {
                    ...jobData
                },
            };
            const result = await jobModel.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await dbClient.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})