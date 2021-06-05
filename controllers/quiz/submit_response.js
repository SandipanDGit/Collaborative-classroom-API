const { submit_response } = require("../../db_access/quiz/submit_response")
const { allotment_exists } = require("../../db_access/quiz/allotment_exists")

exports.submit_response = (req, res, next)=>{
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

    //request data validation
    if(!(req.body.hasOwnProperty("qid") && req.body.qid)){
        res.status(400).json({ status: false, info: "question id(qid) missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("sid") && req.body.sid && typeof(req.body.sid) == "number")){
        res.status(400).json({ status: false, info: "sid missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("quizid") && req.body.quizid && typeof(req.body.quizid) == "number")){
        res.status(400).json({ status: false, info: "quizid missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("response") && req.body.response && typeof(req.body.response) == "number")){
        res.status(400).json({ status: false, info: "response option missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("attempt_status") && req.body.attempt_status && typeof(req.body.attempt_status) == "number")){
        res.status(400).json({ status: false, info: "attempt_status missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("time_taken") && req.body.time_taken && typeof(req.body.time_taken) == "number")){
        res.status(400).json({ status: false, info: "time_taken missing or invalid"})
    }
    
    //authorize if sid in request matches logged in user's sid
    if(req.body.sid !== res.locals.user.id){
        res
        .status(401)
        .json({
            status: false,
            info: "student is unauthorized"
        })
    }

    //fetch question info from request body
    let response_data = {
        qid: req.body.qid,
        sid: req.body.sid,
        quizid: req.body.quizid,
        response: req.body.response,
        attempt_status: req.body.attempt_status,
        time_taken: req.body.time_taken
    }
    
    //check if student is entitled to this quiz
    //by checking if  a record exists in allotment table with given data
    allotment_exists(response_data.quizid, response_data.sid, response_data.qid)
    .then(flag => {
        if(!flag){
            res
            .status(401)
            .json({
                status : "this question is not allotted to this student"
            }) 
            return
        }
        //calling next async function that returns a promise
        //promise will be handled by next .then block
        return submit_response(response_data)
    })
    .then(flag => {
        if(flag){
            res
            .status(201)
            .json({
                status : true,
                info : "response updated",
            })
        }
    })
    .catch(error => {
        res
        .status(500)
        .json({
            status : false,
            info : error
        })
    })  
}