const {dbClient} = require("../database/mongodb-client");

module.exports = dbClient.db("mernJobPortal").collection("demoJobs");