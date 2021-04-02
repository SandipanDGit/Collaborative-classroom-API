//SUPPORTING FILES
const pool = require("../config/db_config")
const {get_user, register} = require("../db_access/auth_db")

//DEPENDENCIES
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const validator = require("validator")

require('dotenv').config()

//REGISTER NEW USER
exports.register = (req, res, next)=>{
    
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

    let query_log = get_user(email, function(query_log){

        //check for sql query error
        if(query_log.error){
            res.status(500).json({
                status: false,
                info: query_log.error
            })
        }
        //non empty result set - user already registered
        else if(query_log.result.length > 0){
            console.log(query_log.result.length)
            res.status(400).json({
                status: false,
                info: "user already registered"
            })
        }    
        //register new user
        else{   
            bcrypt.hash(password, 8, function(error, hash) {
                
                let query_log = register(email, hash, function(query_log){
                    //check for sql error
                    if(query_log.error){
                        res.status(500).json({
                            status: false,
                            info: query_log.error
                        })
                    }
                    //registration success
                    else{
                        console.log("creating new user")
                        res.status(201).json({
                            status: true,
                            info: "user created"
                        })
                    }
                })
            })
        }
 
    })
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

    let query_log = get_user(email, function(query_log){
        if(query_log.error){
            res
            .status(500)
            .json({
                status: failure,
                info: query_log.error
            })
        }
        else if(query_log.result.length == 0){
            res
            .status(400)
            .json({
                status: failure,
                info: "user not found"
            })
        }
        else{
            let stored_hash = query_log.result[0].password
            
            bcrypt.compare(password, stored_hash, (error, result)=>{
                if(result){
                    //CREATE AND SEND JWT TOKEN
                    let token = jwt.sign({ email : email}, process.env.KEY, { expiresIn : 300}, (error, token)=>{
                        res.status(200).json({
                            status: true,
                            info: "login success",
                            token: token
                        })
                    })  
                }
                else{
                    res.status(400).json({
                        status: false,
                        info: "password mismatch"
                    })
                }
            })
            
        }
    })
}

