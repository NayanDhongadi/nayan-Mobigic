const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// keysecret for the gen of auth token 
const keysecret = "Nayan-Dhongadi"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,

    },
    files: [
        {
          fileName: String,
          uniqueCode: String,
          thumbnailUrl: String,

        }
      ]
})

// hashing the password
userSchema.pre("save", async function (next) {

    if (this.isModified("password")) {

        this.password = await bcrypt.hash(this.password, 10)
    }

    next()
})

// generate Token
userSchema.methods.generateAuthtoken = async function () {
    try {
        let token = jwt.sign({ _id: this._id }, keysecret, {
            expiresIn: "1d"
        });


        this.tokens = this.tokens || [];


        this.tokens = this.tokens.concat({ token: token });
        return token;

    } catch (error) {
        console.log(error)
    }
}

const userdb = mongoose.model("users", userSchema)

module.exports = userdb;