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
        class_name : undefined,
        course : undefined,
        subject : undefined,
        institute : undefined
    }

    //validate request parameters
    //class_name is mandatory parameter
    if(!("class_name" in req.body && req.body.class_name !== "")){
        res
        .status(400)
        .json({ 
            status: false,
            info: "class name missing"
        })
        return
        
    }
    else{
        class_data.class_name = req.body.class_name
    }

    //course is optional
    if(!("course" in req.body && typeof(req.body.course) == "string")){
        class_data.course = req.body.course
    }
    else{
        //null/undefined is converted to mysql NULL 
        class_data.course = null
    }

    //subject is optional
    if(!("subject" in req.body && typeof(req.body.subject) == "string")){
        class_data.subject = req.body.subject
    }
    else{
        //null/undefined is converted to mysql NULL 
        class_data.subject = null
    }

    //institute is optional
    if(!("institute" in req.body && typeof(req.body.institute) == "string")){
        class_data.institute = req.body.institute
    }
    else{
        //null/undefined is converted to mysql NULL 
        class_data.institute = null
    }
    

    create_class(class_data)
    .then(data => {
    //when query succeeded
        res
        .status(201)
        .json({
            status: true,
            info: "class created",
            insert_id : data
        })
        return
    })
    .catch(error => {
    //when database error occured
        res
        .status(500)
        .json({
            status: false,
            info: error
        })
        return
    })
}