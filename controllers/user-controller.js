const userModel = require("../models/user-model");

class UserController {
    /**
     * User sign up with google account.
     * @param {Object} params
     * @param {string} params.username - Username
     * @param {string} params.fullName - Username
     * @param {string} params.accessToken - Access token of google
     * @param {"hr" | "candidate"} params.type - Type of user
     * @returns {Promise<{accessToken: string}>}
     */
    async singUpWithGoogle(params) {
        let user = await userModel.findOne({
            email: params.username,
            type: params.type
        })

        if(!user) {
            user = new userModel({
                email: params.username,
                fullName: params.fullName,
                type: params.type,
                token: `${params.accessToken}.${params.type}`
            })

            await user.save()
        }
        else {
            user.token = `${params.accessToken}.${params.type}`
            await user.save()
        }

        return {
            accessToken: user.token
        }
    }

    /**
     * User sign up with google account.
     * @param {Object} params
     * @param {string} params.accessToken - token
     * @param {string} params.user_type - user type
     * @returns {Promise<{
     *  id: string;
     *  email: string;
     *  fullName: string;
     *  type: "hr" | "candidate";
     * } | undefined>}
     */ 
    async getByAccessToken(params) {
        const user = await userModel.findOne({token: params.accessToken})

        if(!user) {
            return undefined
        }
        
        return {
            id: user._id.toHexString(),
            email: user.email,
            fullName: user.fullName,
            type: user.type
        }
    }
}

module.exports = new UserController()