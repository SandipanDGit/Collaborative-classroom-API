const express = require("express")
const createError = require('http-errors')

const router = express.Router()
const { register, login, other } = require("../controllers/auth_controller")

router.post("/register", register)

router.post("/login", login)

// router.get("/other", other)

//catch all route
router.all("*", (req, res, next)=>{
    next(createError.NotFound())
})

//error handler
router.use((error, req, res, next)=>{
    res.status(400).json({
        error: "route or method invalid"
    })
})

module.exports = router

