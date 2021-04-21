const { create_sample } = require("../../db_access/teachers/create_sample.js")
const { teacher_qb } = require("../../db_access/teachers/teacher_qb")

// console.log("reached create_sample controller")
exports.create_sample = (req, res, next)=>{
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

    let sample_data = {
        qbid : undefined,
        //fetch tid from login data
        tid : res.locals.user.id,
        question : undefined,
        option1 : req.body.option1,
        option2 : req.body.option2,
        option3 : req.body.option3,
        option4 : req.body.option4,
        correct_option : req.body.correct_option
    }
    
    let error_flag = 0
    let error_message = ""
    if("qbid" in req.body && req.body.qbid && typeof(req.body.qbid) == "number"){
        sample_data.qbid = req.body.qbid
    }
    else{
        error_flag = 1
        error_message = "question bank id not provided"
    }

    if("question" in req.body && req.body.question){
        sample_data.question = req.body.question
    }
    else{
        error_flag = 1
        error_message = "question statement not provided"
    }  
    if(error_flag){
        res
        .status(400)
        .json({
            status: false,
            info : error_message
        })
        return
    }

    //authorize if teacher controls the qb
    //returns tid who controls the question bank
    teacher_qb(sample_data.tid, sample_data.qbid)
    .then( data => {
        //temporary
        if(sample_data.tid !== data){
            res
            .status(401)
            .json({
                status: false,
                info: "teacher is not authorized to add question in this qb"
            })
            return
        }
        //chaining promise
        create_sample(sample_data)
    })
    .then((data)=>{
        res
        .status(201)
        .json({
            status: true,
            info: `sample question created in qb : ${sample_data.qbid}`,
            question_id : data
        })
        return
    })
    .catch((error)=>{
        //when database error occured
        res
        .status(500)
        .json({
            status: false,
            info: error.message
        })
    })
    
}