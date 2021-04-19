const { create_qbank } = require("../../db_access/teachers/create_qbank.js")
const date = require("date-and-time")

exports.create_qbank = (req, res, next)=>{
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
            info: "user not authorized to create class"
        })
        return
    }

    let qbank_data = {
        cid : undefined,
        qb_title : undefined,
        qb_description : undefined,
        min_contribution : undefined,
        max_contribution : undefined,
        contribution_deadline : undefined
    }

    //CHECK IF ALL THE PARAMETERS ARE PROVIDED IN REQUEST

    if("cid" in req.body && req.body.cid !== undefined) 
        qbank_data.cid = req.body.cid
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "class id not provided"
        })
        return
    }

    if("qb_title" in req.body && req.body.qb_title !== undefined) 
        qbank_data.qb_title = req.body.qb_title
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "qb title not provided"
        })
        return
    }

    if("qb_description" in req.body && req.body.qb_description !== undefined) 
        qbank_data.qb_description = req.body.qb_description
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "qb description not provided"
        })
        return
    }
    //check if min_contribution is between 0 and 100
    if("min_contribution" in req.body && req.body.min_contribution !== undefined 
        && req.body.min_contribution>=0 && req.body.min_contribution<=100){

            qbank_data.min_contribution = req.body.min_contribution
    }
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "minimum contribution not provided or out of range"
        })
        return
    }

    //check if 0 < max_contribution <= 100
    if("max_contribution" in req.body && req.body.max_contribution !== undefined 
        && req.body.max_contribution>0 && req.body.max_contribution<=100){

            qbank_data.max_contribution = req.body.max_contribution
    }
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "maximum contribution not provided or out of range"
        })
        return
    }

    //check if contribution deadline is after current date
    //javascript timestamp is in mili seconds, unix timestamp is in seconds. division by 1000 gives unix timestamp
    //API is designed to accept in mili seconds


    if("contribution_deadline" in req.body && req.body.contribution_deadline !== undefined && req.body.contribution_deadline > Date.now()){
        // qbank_data.contribution_deadline = date.format(new Date(req.body.contribution_deadline), 'YYYY/MM/DD HH:mm:ss') 
        // console.log(qbank_data.contribution_deadline)
        qbank_data.contribution_deadline = req.body.contribution_deadline
    }     
    else{
        res
        .status(400)
        .json({
            status: false,
            info: "contribution_deadline not provided or invalid"
        })
        return
    }
    // res.json({ })

    create_qbank(qbank_data)
    .then((data)=>{
        res
        .status(201)
        .json({
            status: true,
            info: "question bank created",
            insert_id: data
        })
    })
    .catch((error)=>{
        //when database error occured
        res
        .status(500)
        .json({
            status: false,
            info: error
        })
    })
}