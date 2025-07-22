import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'

const app = express()

const port = process.env.PORT || 3000

import authController from './controllers/auth.js'


mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on("connected", () => {
    console.log(`🚀Connected to MongoDB ${mongoose.connection.name}.`);
})

app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(morgan('dev'))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
        })
    })
)

app.get("/", async (req,res) => {
    res.render("index.ejs", {
        user: req.session.user,
    })
})

app.use('/auth', authController)

app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});



app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
})