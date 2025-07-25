import express from "express"
import Venue from "../models/venues.js"
import isAdmin from "../middleware/is-admin.js"

const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const venues = await Venue.find()
        res.render('venues/index.ejs', { venues })
    } catch(err) {
        console.log(err)
        res.redirect('/')
    }
})

router.get('/new', (req, res) => {
    res.render('venues/new')
})

router.post('/', isAdmin, async (req, res) => {
    try {
        const venue = await Venue.create(req.body)
        res.redirect('/venues')
    } catch (err) {
        console.log("Venue creation failed:", err.message)
        res.status(400).render("venues/new.ejs", {
            error: 'All fields are required. Please try again.',
            oldInput: req.body
    })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id)
        if (!venue) return res.status(404). send("Venue not found")
            res.render("venues/show")
    } catch (err) {
        console.log(err)
        res.status(500).send("Server Error")
    }
})



export default router