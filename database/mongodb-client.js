const { MongoClient, ServerApiVersion } = require('mongodb');
const mongodb_uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@job-portal.42ijqpj.mongodb.net/mernJobPortal?retryWrites=true&w=majority&appName=job-portal`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
exports.dbClient = new MongoClient(mongodb_uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

exports.mongodbUri = mongodb_uri