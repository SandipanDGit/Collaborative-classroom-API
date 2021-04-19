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

    //request data validation
    
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
    })
    .catch(error => {
        res
        .status(500)
        .json({
            status : false,
            info : error
        })
        return
    })


    add_question(question_data)
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