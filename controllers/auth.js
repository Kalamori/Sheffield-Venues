import express from "express"
import bcrypt from "bcrypt"
import User from '../models/user.js'

const router = express.Router()

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs")
})

router.post("/sign-up", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (userInDatabase) {
        return res.send("Username already taken.")
    }
    if (req.body.password !== req.body.confirmPassword) {
        return res.send("Password and Confrim Password must match")
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    req.body.password = hashedPassword;
    const user = await User.create(req.body);
    res.send(`Thanks for signing up ${user.username}`)
})

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs")
})

router.post("/sign-in", async (req, res) => {
    const userInDatabase = await User.findOne({ username: req.body.username })
    if (!userInDatabase) {
        return res.send("Login failed. Please try again")
    }
    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    )
    if (!validPassword) {
        return res.send("Login failed. Please try again.")
    }
    res.send("Request to sign in received!")
})

export default router
