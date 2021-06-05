const { get_allocations } = require("../../db_access/quiz/get_allocations")

exports.get_allocations = (req, res, next)=>{
    if(!res.locals.authenticated){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authenticated"
        })
        return
    }
    //authorize role of user as student
    if(res.locals.user.role !== "student"){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authorized as student"
        })
        return
    }
    //validate parameters
    if(!(req.body.hasOwnProperty("quizid") && req.body.quizid && typeof(req.body.quizid) == "number")){
        res
        .status(400)
        .json({ 
            status: false, 
            info: "quizid missing or invalid"
        })
    }

    let sid = res.locals.user.id
    let quizid = req.body.quizid

    get_allocations(sid, quizid)
    .then(data => {
        res
        .status(200)
        .json({
            status: true,
            info: "questions fetched",
            data: data
        })
    })
    .catch(err => {
        res
        .status(500)
        .json({
            status: false,
            info: err.message
        })
    })
}