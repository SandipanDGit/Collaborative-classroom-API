const express = require("express")
const createError = require('http-errors')

const router = express.Router()
const { register, login } = require("../controllers/auth_controller")

router.post("/register", register)

router.post("/login", login)

// router.get("/other", other)

//catch all route
router.all("*", (req, res, next)=>{
    next(createError.NotFound("route or method invalid"))
})

//error handler
router.use((error, req, res, next)=>{
    res.status(400).json({
        status: false,
        error: error.message
    })
})

module.exports = router

