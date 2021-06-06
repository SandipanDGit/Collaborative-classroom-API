const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of students entitled for a quiz
exports.fetch_details = (sid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT email, full_name, course, specialization, institute from students where sid = ?`
        pool.query(query, [sid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(results.length == 0){
                reject(new Error("no students found"))
            }
            else{
                resolve(results[0])  
            }
        })
    })
}