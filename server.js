import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from 'connect-mongo'

import venuesController from './controllers/venues.js'

import isSignedIn from './middleware/is-signed-in.js'
import passUserToView from './middleware/pass-user-to-view.js'

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

app.use(passUserToView)

app.get("/", (req, res) => {
    if (req.session.user) {
        res.redirect(`/users/${req.session.user._id}/venues`)
    } else {
    res.render("index.ejs");
    }

})

app.use('/auth', authController)
app.use(isSignedIn)
app.use('/users/:userId/venues', venuesController)

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
})