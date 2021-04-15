const { create_class } = require("../../db_access/teachers/create_class")
const { exists_teacher } = require("../../db_access/teachers/exists_teacher")
//CLASS CREATION
exports.create_class = (req, res, next)=>{
    
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

    let class_data = {
        //fetch class admin id from login data - token
        admin : res.locals.user.id,
        //fetch other info from request body
        class_name : req.body.class_name,
        course : req.body.course ,
        subject : req.body.subject,
        institute : req.body.institute
    }

    create_class(class_data)
    .then(data => {
    //when query succeeded
        res
        .status(201)
        .json({
            status: true,
            info: "class created"
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