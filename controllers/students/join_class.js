const { exists_student } = require("../../db_access/students/exists_student")
const { join_class } = require("../../db_access/students/join_class")

//=======================CLASS JOINING FUNCTION ==============================

exports.join_class = (req, res, next)=>{
    //check if authentication flags were set in verify_token middleware
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
            info: "user not authorized to join class"
        })
        return
    }
    //fetch student id from login data - token
    let sid = res.locals.user.id
    
    //fetch other info from request body
    let cid = undefined
    if(req.body.hasOwnProperty("cid") && req.body.cid)
        cid = req.body.cid
    else{
        res.status(400).json({ status: false, info: "cid missing"})
        return
    }


    join_class(sid, cid)
    .then(data => {
    //when query succeeded
        res
        .status(201)
        .json({
            status: true,
            info: "class joined"
        })
    })
    .catch(error => {
    //when database error occured
        res
        .status(500)
        .json({
            status: false,
            info: error
        })
    })
}


    // //check if student id exists
    // sid = res.locals.user.id
    // exists_student(sid)
    // .then(data => {

    //     //if returned false, sid does not exist
    //     if(!data){
    //         res
    //         .status(404)
    //         .json({
    //             status: false,
    //             info: "student ID does not exists"
    //         })
    //         return
    //     }
    //     else{   //student exists
            
    //     }
    // })
    // .catch((error)=>{
    // //when database error occured
    //     res
    //     .status(500)
    //     .json({
    //         status: false,
    //         info: error
    //     })
    //     return
    // })