const express = require("express")
const jwt = require("jsonwebtoken")

exports.verify_token = (req, res, next)=>{

    //check if jwt provided 
    if(!req.headers.authorization){
        res
        .status(404)
        .json({
            status: false,
            info: "jwt not provided"
        })
    }
    else{
    //get token from request and verify jwt token
        let token = req.headers.authorization.split(" ")[1]
        jwt.verify(token, process.env.KEY, (error, decoded)=>{
            if(error){
               res
               .status(404)
               .json({
                    status: false,
                    info: error.message
                })
            }
            else{
                //append res.locale to be checked by next middleware
                res.locals.authenticated = true
                res.locals.user = decoded
                next()
            }
        })
    }
}
