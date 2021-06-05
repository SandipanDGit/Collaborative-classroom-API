const express = require("express")
const createError = require('http-errors')

const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { submit_response } = require("../controllers/quiz/submit_response")
const { get_allocations } = require("../controllers/quiz/get_allocations")


router.post("/submit_response", verify_token.verify_token, submit_response)

router.post("/get_allocations", verify_token.verify_token, get_allocations)

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

