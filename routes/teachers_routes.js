const express = require("express")
const httpErrors = require("http-errors")

const app = express()
const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { create_class } = require("../controllers/teachers/create_class")
const { create_qbank } = require("../controllers/teachers/create_qbank")
const { create_sample } = require("../controllers/teachers/create_sample")
const { create_quiz } = require("../controllers/teachers/create_quiz")
const { rate_question } = require("../controllers/teachers/rate_question")
const { allocate_questions } = require("../controllers/teachers/allocate_questions")
const { fetch_details } = require("../controllers/teachers/fetch_details")
const { fetch_quizzes } = require("../controllers/teachers/fetch_quizzes")
const { fetch_classes } = require("../controllers/teachers/fetch_classes")

router.post("/create_class", verify_token.verify_token, create_class)
router.post("/create_qbank", verify_token.verify_token, create_qbank)
router.post("/create_sample", verify_token.verify_token, create_sample)
router.post("/create_quiz", verify_token.verify_token, create_quiz)
router.post("/rate_question", verify_token.verify_token, rate_question)
router.post("/allocate_questions", verify_token.verify_token, allocate_questions)
router.get("/fetch_details", verify_token.verify_token, fetch_details)
router.get("/fetch_quizzes", verify_token.verify_token, fetch_quizzes)
router.get("/fetch_classes", verify_token.verify_token, fetch_classes)

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