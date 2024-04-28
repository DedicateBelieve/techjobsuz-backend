const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const UserModel = new Schema(
    {
        type: {
            type: String,
            enum: ['candidate', 'hr'],
            required: true
        },
        email: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

module.exports = mongoose.model("users", UserModel)