const express = require("express")
const httpErrors = require("http-errors")

const app = express()
const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { create_class } = require("../controllers/teachers/create_class")
const { create_qbank } = require("../controllers/teachers/create_qbank")
const { create_sample } = require("../controllers/teachers/create_sample")
const { create_quiz } = require("../controllers/teachers/create_quiz")

router.post("/create_class", verify_token.verify_token, create_class)
router.post("/create_qbank", verify_token.verify_token, create_qbank)
router.post("/create_sample", verify_token.verify_token, create_sample)
router.post("/create_quiz", verify_token.verify_token, create_quiz)

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