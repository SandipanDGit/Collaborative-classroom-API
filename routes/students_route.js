const express = require("express")
const createError = require('http-errors')

const router = express.Router()
const verify_token = require("../controllers/verify_token")
const dashboard = require("../controllers/students_controller")

/*NOTE

1. if exports.xxx = ()=>{} syntax used, it exports an object 
containing all the exports, 
must be imported by name using destructuring or be called as object members

2. if module.exports = single_function_name syntax is used, it can be imported and used directly 
*/

router.get("/dashboard", verify_token.verify_token, dashboard)

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