const { create_allocation } = require("../../services/create_allocation.js")
const { authorize_question_allocation } = require("../../db_access/authorize_question_allocation")
const { students_by_quiz } = require("../../db_access/students/fetch/students_by_quiz")
const { questions_by_quiz } = require("../../db_access/teachers/fetch/questions_by_quiz")
const { save_allocation } = require("../../db_access/teachers/save_allocation.js")

exports.allocate_questions = (req, res, next)=>{
    if(!res.locals.authenticated){
        res
        .status(401)
        .json({
            status: false,
            info: "user not authenticated"
        })
        return
    }
    
    //authorize role of user as teacher
    if(res.locals.user.role !== "teacher"){
        
        res
        .status(401)
        .json({
            status: false,
            info: "user not authorized to create class"
        })
        return
    }
    if(!(res.locals.user.hasOwnProperty("id") && res.locals.user["id"])){
        res
        .status(401)
        .json({
            status: false,
            info: "user id not found in authentication token"
        })
        return
    }
    //validate the quiz id in req body 
    if(!req.body.quizid || !req.body.hasOwnProperty('quizid') || typeof(req.body.quizid) !== 'number'){
        res
        .status(400)
        .json({
            status: false,
            info : "qid not provided or invalid"
        })
        return
    }
    if(!req.body.question_count || !req.body.hasOwnProperty('question_count') || typeof(req.body.question_count) !== 'number'){
        res
        .status(400)
        .json({
            status: false,
            info : "question count to allocate not provided or invalid"
        })
        return
    }
    
    let students = []
    //get data from request body
    let quizid = req.body.quizid
    let questions_per_head = req.body.question_count
    
    //AUTHORIZE QUESTION ALLOCATION BY THE TID
    authorize_question_allocation(quizid)
    .then(tid => {
        //teacher who is in charge of the question does not match with authenticated teacher who logged in
        if(tid != res.locals.user["id"]){    
            res
            .status(401)
            .json({
                status: false,
                info: "teacher unauthorized"
            })
            return   
        }
        //fetch students entitled in this quiz
        return students_by_quiz(quizid)
    })
    .then(data => {
        students = data
        
        //fetch all questions available
        return questions_by_quiz(quizid)
    })
    .then(questions => {
        //create allocation
        return create_allocation(quizid, students, questions, questions_per_head)
    })
    .then(allocation_map => {
        //save the allocation data
        return save_allocation(allocation_map)
    })
    .then(affected_rows => {
        res
        .status(200)
        .json({ 
            status: true, 
            info: `successfully inserted: ${affected_rows} rows`
        })
        return
    })
    .catch(error => {
        res
        .status(500)
        .json({
            status: false,
            info : error.message
        })
        return
    })    
}