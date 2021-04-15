const express = require("express")
const httpErrors = require("http-errors")

const app = express()
const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { create_class } = require("../controllers/teachers/create_class")
const { create_qbank } = require("../controllers/teachers/create_qbank")

router.post("/create_class", verify_token.verify_token, create_class)
router.post("/create_qbank", verify_token.verify_token, create_qbank)

//catch all route
router.all("*", (req, res, next)=>{
    next(new Error("route or method invalid"))
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