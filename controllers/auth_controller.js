//SUPPORTING FILES
const {get_user_cred, db_register} = require("../db_access/auth_db")
const { validate_password } = require("../services/misc/validate_password")

//DEPENDENCIES
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

require('dotenv').config()

//REGISTER NEW USER
exports.register = (req, res, next)=>{
    
    let user_data = {
        email : req.body.email,
        password : req.body.password,
        user_name : req.body.name,
        role : req.body.role,
    }
    user_data.course = (req.body.course)? user_data.course : "NULL"
    user_data.specialization = (req.body.specialization)? user_data.specialization : "NULL"
    user_data.institute = (req.body.institute)? user_data.institute : "NULL"

    if(!validator.isEmail(user_data.email)){
        res.status(400).json({
            status: false,
            info: "email not valid"
        })
    }
    else if(!user_data.password){
        res.status(400).json({
            status: false,
            info: "password not provided"
        })
    }
    else if(!validate_password(user_data.password)){
        res.status(400).json({
            status: false,
            info: "password format not valid"
        })
    }
    else if(!user_data.user_name){
        res.status(400).json({
            status: false,
            info: "user name not provided"
        })
    }
    else if(!(user_data.role === "student" || user_data.role === "teacher")){
        res.status(400).json({
            status: false,
            info: "invalid user role"
        })
    }
    else{
        // console.log(`passing email : ${user_data.email}`)
        get_user_cred(user_data.email)
        .then((result)=>{
            
            if(result){
            //non empty result set - user already registered
                res.status(400).json({
                    status: false,
                    info: "user already registered"
                })
            }    
            else{   //register new user
                bcrypt.hash(user_data.password, 8, function(error, hash) {
                    
                    user_data.password = hash
                    db_register(user_data)
                    .then((data)=>{
                        //registration success
                        console.log("creating new user")
                        res.status(201).json({
                            status: true,
                            info: "user created"
                        })
                    })
                    .catch((error)=>{
                    //db error
                        res.status(500).json({
                            status: false,
                            info: error.message
                        })
                    })
                })
            }

        }).catch((error)=>{
            res
            .status(500)
            .json({
                status: false,
                info: error.message
            })
        })
    }
}

//LOGIN FUNCTION
exports.login = (req, res, next)=>{
    
    let email = req.body.email
    let password = req.body.password

    if(!validator.isEmail(email)){
        res.status(400).json({
            status: false,
            info: "email not valid"
        })
    }
    else if(!password){
        res.status(400).json({
            status: false,
            info: "password not provided"
        })
    }
    else if(!validate_password(password)){
        res.status(400).json({
            status: false,
            info: "password format not valid"
        })
    }
    else{
        get_user_cred(email)
        .then((user)=>{
            if(!user){    //user not found
                res
                .status(400)
                .json({
                    status: false,
                    info: "user not found"
                })
            }
            else{   //user found and result contains role
                let stored_hash = user.password
                
                let user_cred = {
                    id : user.id,
                    email : email,
                    name : user.name,
                    role : user.role
                }
                bcrypt.compare(password, stored_hash, (err, compare_result)=>{

                    if(!compare_result){    //password mismatch
                        res
                        .status(400)
                        .json({
                            status: false,
                            info: "password mismatch"
                        })  
                    }
                    else{   
                        //CREATE AND SEND JWT TOKEN 
                        //JWT payload should contain role also (student or teacher)
                        //token hardcoded to expire in 5 mins
                        let token = jwt.sign(user_cred, process.env.KEY, { expiresIn : 3600}, (error, token)=>{  
                            res.status(200).json({
                                status: true,
                                info: "login success",
                                token: token
                            })
                        })
                    }
                })
            }
        })
        .catch((error)=>{
            res
            .status(500)
            .json({
                status: false,
                info: error.message
            })
        })
    }
}
