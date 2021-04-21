const { add_question } = require("../../db_access/students/add_question")
const { student_qb } = require("../../db_access/students/student_qb")

exports.add_question = (req, res, next)=>{
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
    if(!(req.body.hasOwnProperty("qbid") && req.body.qbid)){
        res.status(400).json({ status: false, info: "qbid missing"})
    }
    if(!(req.body.hasOwnProperty("question") && req.body.question && typeof(req.body.question) == "string")){
        res.status(400).json({ status: false, info: "question missing"})
    }
    if(!(req.body.hasOwnProperty("correct_option") && req.body.correct_option && typeof(req.body.correct_option) == "number")){
        res.status(400).json({ status: false, info: "correct option missing"})
    }
    if(!(req.body.hasOwnProperty("option1") && req.body.option1 && typeof(req.body.option1) == "string")){
        res.status(400).json({ status: false, info: "option1 missing"})
    }
    if(!(req.body.hasOwnProperty("option2") && req.body.option1 && typeof(req.body.option2) == "string")){
        res.status(400).json({ status: false, info: "option2 missing"})
    }
    if(!(req.body.hasOwnProperty("option3") && req.body.option3 && typeof(req.body.option3) == "string")){
        res.status(400).json({ status: false, info: "option3 missing"})
    }
    if(!(req.body.hasOwnProperty("option4") && req.body.option4 && typeof(req.body.option4) == "string")){
        res.status(400).json({ status: false, info: "option4 missing"})
    }
    
    //fetch question info from request body
    let question_data = {
        qbid : req.body.qbid,
        //fetch sid id from login data - token 
        sid : res.locals.user.id,
        question : req.body.question,
        option1 : req.body.option1,
        option2 : req.body.option2,
        option3 : req.body.option3,
        option4 : req.body.option4,
        correct_option : req.body.correct_option
    }
    
    //check if student belongs to the class which owns the qbank
    //returns count of matches sid-cid in members table (should be 1)
    student_qb(question_data.qbid, question_data.sid)
    .then(data => {
        if(!data){
            res
            .status(401)
            .json({
                status : "student is not a member of the class which owns the question bank"
            }) 
            return
        }
        //calling next async function that returns a promise
        //promise will be handled by next .then block
        return add_question(question_data)
    })
    .then(data => {
        if(data){
            res
            .status(201)
            .json({
                status : true,
                info : "question added",
                question_id : data
            })
        }
        else{
            res
            .status(500)
            .json({
                status : false,
                info : "question could not be added"
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