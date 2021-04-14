const express = require("express")

const app = express()
const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { create_class } = require("../controllers/teachers_controller")

router.post("/create_class", verify_token.verify_token, create_class)

//catch all route
router.all("*", (req, res, next)=>{
    next(createError.NotFound("route or method invalid"))
})

//error handler
router.use((error, req, res, next)=>{
    res
    .status(400)
    .json({
        error: error.message
    })
})

module.exports = router