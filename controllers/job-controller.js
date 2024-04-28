const { ObjectId } = require("mongodb");
const smtpClient = require("../client/smtp-client");
const mongodbClient = require("../database/mongodb-client");
const jobModel = require("../models/job-model");

class JobController {
    /**
     * Assign the project to an employee.
     * @param {Object} params - Applicant apply to vacancy data.
     * @param {string} params.linkToResume - Applicant's link to resume.
     * @param {string} params.jobId - Job id
     * @returns {void}
     */
    async apply(params) {
        if(!this.#isURL(params.linkToResume)) {
            throw new Error(`Link to resume is invalid: ${params.linkToResume}`)
        }

        const applyJob = await jobModel.findOne({_id: new ObjectId(params.jobId)});

        await smtpClient.sendMail({
            from: '"Techjobs.uz" <techjobsuz@yahoo.com>', // sender address
            to: applyJob.postedBy, // list of receivers
            subject: "You have a new applicant for your ", // Subject line
            html: this.#generateHTMLForm({
                linkToResume: params.linkToResume,
                job: {
                    link: `http://localhost:5173/job/${applyJob._id.toHexString()}`,
                    title: applyJob.jobTitle,
                    companyName: applyJob.companyName
                }
            })
        });

        return
    }

    /**
     * Validation URL address
     * @param {string} url - URL address 
     * @returns {boolean} if text is valid retrun true, else retrun false
     */
    #isURL(url) {
        const regexpURL = /^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)$/gm

        if(typeof url !== "string") {
            return false
        }

        return regexpURL.test(url) 
    }

    /**
     * Generate html form for send message
     * @param {Object} params 
     * @param {string} params.linkToResume
     * @param {Object} params.job
     * @param {string} params.job.link
     * @param {string} params.job.title
     * @param {string} params.job.companyName
     * @returns string
     */
    #generateHTMLForm(params) {
        return `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Job Application Notification</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5; /* Slightly darker white background */
                    color: #333333;
                    margin: 0;
                    padding: 0;
                }
        
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff; /* White background for the form */
                    border-radius: 10px;
                    text-align: center;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
        
                h1 {
                    color: #333333;
                }
        
                .company-name {
                    color: #000000; /* Blue color */
                }
        
                .job-link {
                    color: #337ab7; /* Blue link color */
                    text-decoration: none; /* No underline */
                }
        
                .resume-link {
                    width: 170px;
                    background-color: #337ab7; /* Blue background for the button */
                    border-radius: 5px;
                    display: inline-block;
                    font-size: 18px;
                    font-family: Helvetica, Arial, sans-serif;
                    font-weight: bold;
                    line-height: 50px;
                    text-align: center;
                    text-decoration: none;
                    -webkit-text-size-adjust: none;
                }
        
                .resume-link a {
                    color: #ffffff; /* White text for links inside .resume-link */
                }
        
                .resume-link:hover {
                    background-color: #286090; /* Darker blue on hover */
                }
            </style>
        </head>
        
        <body>
            <div class="container">
                <h1>New Job Application</h1>
                <p>Please check out your new application on our platform</p>
                <h2 class="company-name">${params.job.companyName}</h2>
                <h2>
                    <a href="${params.job.link}" class="job-link">${params.job.title}</a>
                </h2>
                <div class="resume-link">
                    <a rel="noopener" target="_blank" href="${params.linkToResume}">View CV</a>
                </div>
            </div>
        </body>
        
        </html>
        
           
    `
    }
}

module.exports = new JobController()