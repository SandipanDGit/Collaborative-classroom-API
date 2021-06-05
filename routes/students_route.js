const express = require("express")
const createError = require('http-errors')

const router = express.Router()
const verify_token = require("../controllers/verify_token")
const { join_class } = require("../controllers/students/join_class")
const { add_question } = require("../controllers/students/add_question")

/*NOTE

1. if exports.xxx = ()=>{} syntax used, it exports an object 
containing all the exports, 
must be imported by name using destructuring or be called as object members

2. if module.exports = single_function_name syntax is used, it can be imported and used directly 
*/

router.post("/join_class", verify_token.verify_token, join_class)
router.post("/add_question", verify_token.verify_token, add_question)

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