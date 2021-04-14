const pool = require("../config/db_config")
require('dotenv').config()

exports.get_user_cred = (email)=>{

    return new Promise((resolve, reject)=>{
        let role 

        //CHECK IF EXISTS IN STUDENTS TABLE
        let query = `select sid, full_name, password from ${process.env.DB_NAME}.students where email = ?`
        pool.query(query, [email], (error, results, fields)=>{
            
            //error occured
            if(error) 
                reject(error)
            
            //empty object returned - no user found
            else if(Object.keys(results).length === 0){
                //can not resolve yet because teachers table is yet to check
            }

            //empty array returned
            else if(results.length === 0){
                //can not resolve yet because teachers table is yet to check
            }            
            //non empty object or array returned - user exists
            else if(results.length > 0){
                let user = {
                    id : results[0].sid,
                    name : results[0].full_name,
                    password : results[0].password,
                    role : "student"
                }
                resolve(user)
            }
                  
        })

        //CHECK IF EXISTS IN TEACHERS TABLE
        query = `select tid, full_name, password from ${process.env.DB_NAME}.teachers where email = ?`
        // console.log(`searching email : ${email}`)
        pool.query(query, [email], (error, results, fields)=>{
            
            //error occured
            if(error) reject(error)
            
            //empty object returned - no user found
            else if(Object.keys(results).length === 0){
                resolve(0)
            }

            //empty array returned
            else if(results.length === 0){
                 resolve(0)
            }
                
            
            //non empty object or array returned - user exists
            else{
                let user = {
                    id : results[0].tid,
                    name : results[0].full_name,
                    password : results[0].password,
                    role : "teacher"
                }
                resolve(user)
            }
             
        })
    })
}

exports.db_register = (user_data, callback)=>{

    return new Promise((resolve, reject)=>{
        let email = user_data.email
        let password = user_data.password
        let name = user_data.user_name
        let role = user_data.role
        let course = user_data.course
        let specialization = user_data.specialization
        let institute = user_data.institute

        if(user_data.role === "student"){
            let query = `insert into ${process.env.DB_NAME}.students (sid, email, password, full_name, course, specialization, institute) values(0, ?, ?, ?, ?, ?, ?);`
            pool.query(query, [email, password, name, course, specialization, institute], (error, result, fields)=>{

                if(!error) resolve(1)
                else reject(error)        
            })
        }
        else{
            let query = `insert into ${process.env.DB_NAME}.teachers (tid, email, password, full_name, institute) values(0, ?, ?, ?, ?);`
            pool.query(query, [email, password, name, institute], (error, result, fields)=>{

                if(!error)resolve(1)
                else reject(error)        
            })
        }
    })
}

