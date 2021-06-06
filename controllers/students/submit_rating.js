const { submit_rating } = require("../../db_access/students/submit_rating")
const { rating_exists } = require("../../db_access/students/rating_exists")

exports.submit_rating = (req, res, next)=>{
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
    if(!(req.body.hasOwnProperty("quizid") && req.body.quizid && typeof(req.body.quizid) == "number")){
        res.status(400).json({ status: false, info: "quizid missing or invalid"})
    }
    if(!(req.body.hasOwnProperty("rating") && req.body.rating && typeof(req.body.rating) == "number")){
        res.status(400).json({ status: false, info: "rating option missing or invalid"})
    }
    
    //fetch sid from res.locals.user.id
    //fetch question info from request body
    let rating_data = {
        qid: req.body.qid,
        sid: res.locals.user.id,
        quizid: req.body.quizid,
        rating: req.body.rating,
    }
    
    //check if student is entitled to this quiz
    //by checking if a record exists in allotment table with given data
    rating_exists(rating_data.quizid, rating_data.sid, rating_data.qid)
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
        return submit_rating(rating_data)
    })
    .then(flag => {
        if(flag){
            res
            .status(201)
            .json({
                status : true,
                info : "rating updated",
            })
        }
    })
    .catch(error => {
        res
        .status(500)
        .json({
            status : false,
            info : error.message
        })
    })  
}