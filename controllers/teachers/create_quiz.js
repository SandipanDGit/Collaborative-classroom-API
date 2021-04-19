const { create_quiz } = require("../../db_access/teachers/create_quiz.js")
const { teacher_qb } = require("../../db_access/teachers/teacher_qb")
const { get_deadline } = require("../../db_access/get_deadline")
const date = require("date-and-time")

exports.create_quiz = (req, res, next)=>{
    if(!res.locals.authenticated){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authenticated"
        })
        return
    }
    //authorize role of user as teacher
    if(res.locals.user.role !== "teacher"){
        
        res
        .status(400)
        .json({
            status: false,
            info: "user not authorized to create quiz"
        })
        return
    }

    //authorize teacher if the question bank is under him
    let tid = res.locals.user.id
    let qbid = req.body.qbid
    teacher_qb(tid, qbid)
    .then(data => {        
        if(data == tid){
            //continue
        }
        else{
            res
            .status(401)
            .json({
                status: false,
                info: "teacher not in charge of this question bank"
            })
            return
        }
    })
    .catch(error => {
        res
        .status(500)
        .json({
            status: false,
            info: error
        })
        return
    })

    //fetch the quiz data from request body
    let quiz_data = {
        qbid: req.body.qbid,
        duration: req.body.duration,
        marks_per_q: req.body.marks_per_q,
        start_time: req.body.start_time,
        instructions: req.body.instructions
    }

    //start time should be at least after 2 hours of contribution deadine
    //should  be supplied as javascript timestamp (milisecond precision)

    //returns either 0 or contribution deadline in js timestamp
    get_deadline(quiz_data.qbid)
    .then(data => {
        if(data == 0){
            res
            .status(404)
            .json({
                status: false,
                info: "no question bank found"
            })
            return
        }
        else if(quiz_data.start_time - data >= 7200000){
            //continue
        }
        else{
            res
            .status(400)
            .json({
                status: false,
                info: "quiz start time must be at least 2 hours post contribution deadline time"
            })
            return
        }
    })
    .catch(error =>{
        res
        .status(400)
        .json({
            status: false,
            info: error
        })
        return
    })


    //create quiz
    create_quiz(quiz_data)
    .then(data => {
        res
        .status(201)
        .json({
            status : true,
            info : "quiz created",
            insert_id: data
        })
        return
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
}
