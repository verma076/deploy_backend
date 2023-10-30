const express = require("express")
const { UserModel } = require("../model/user.model")
const userRouter = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const { blacklist } = require("../blacklist")

userRouter.post("/register", async (req, res) => {
    const { name, email, gender, password, age, city, is_married } = req.body
    try {
        bcrypt.hash(password, 5, async (err, hash) => {
            const user = new UserModel({ name, email, gender, password: hash, age, city, is_married })
            await user.save()

            res.status(200).json({ msg: "New user has been registered in the database" })
        });
    } catch (error) {
        res.status(4000).json({ err: error })
    }

})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await UserModel.findOne({ email })
       
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                const token = jwt.sign({ userID: user._id, username: user.username }, 'masai', { expiresIn: "7d" })

                if (result) {
                    res.status(200).json({ msg: "Login successfully", token })
                } else {
                    res.status(200).json({ msg: "wrong Credentials Entered" })
                }
            })

        } else {
            res.status(200).json({ msg: "wrong Credentials entered" })
        }
    } catch (err) {
        res.status(400).json({ error: err })
    }
})


userRouter.get("/logout", (req, res) => {
    const token = req.headers.authorization
    try {
        blacklist.push(token)
        res.status(200).send({ "msg": "User has been logged out" })
    } catch (error) {
        res.status(400).send({ "error": error })
    }
})





module.exports = {
    userRouter
}