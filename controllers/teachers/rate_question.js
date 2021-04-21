const { rate_question } = require("../../db_access/teachers/rate_question.js")
const { authorize_qrating_update } = require("../../db_access/authorize_qrating_update")

exports.rate_question = (req, res, next)=>{
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
    
    let rating_data = {
        tid : res.locals.user.id,
        qid : req.body.qid,
        qbid : req.body.qbid,
        acceptance: req.body.acceptance,
        rating: req.body.rating
    }
    //VALIDATE ACCEPTANCE STATUS
    if(!(req.body.acceptance === "accepted" || req.body.acceptance === "rejected" || req.body.acceptance === "repitition")){
        res.status(400).json({ status: false, info: "acceptance status missing or invalid"})
        return
    }

    //VALIDATE RATING
    if(!(req.body.rating >=1 || req.body.rating <=5)){
        res.status(400).json({ status: false, info: "rating missing or invalid"})
        return
    }
    
    let error_flag = 0
    let error_message = ""

    //VALIDATE QUESTION BANK ID
    if("qbid" in req.body && req.body.qbid && typeof(req.body.qbid) == "number"){
        //continue
    }
    else{
        error_flag = 1
        error_message = "question bank id not provided or invalid format"
    }

    //VALIDATE QUESTION ID
    if("qid" in req.body && req.body.qid && typeof(req.body.qbid) == "number"){
        //continue
    }
    else{
        error_flag = 1
        error_message = "question id not provided or invalid format"
    }  

    

    //check if validation error
    if(error_flag){
        res
        .status(400)
        .json({
            status: false,
            info : error_message
        })
        return
    }

    //AUTHORIZE QUESTION RATING UPDATE BY THE TID
    //returns tid
    authorize_qrating_update(rating_data.qid)
    .then(tid => {
        //teacher who is in charge of the question does not match with authenticated teacher who logged in
        if(tid !== rating_data.tid){    
            res
            .status(401)
            .json({
                status: false,
                info: "teacher unauthorized"
            })
            return   
        }
        //UPDATE THE RATING --- NEXT .then() WILL HANDLE ITS FULFILLMENT
        return rate_question(rating_data)
    })
    .then(data => {
        res
        .status(201)
        .json({
            status: true,
            info: `acceptance status and rating is updated`,
        })
        return
    })
    .catch(error => {
        // console.log("catch block")
        res
        .status(500)
        .json({
            status: false,
            info : error.message
        })
        return
    })    
}