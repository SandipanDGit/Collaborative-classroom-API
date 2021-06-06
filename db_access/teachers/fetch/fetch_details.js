const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of students entitled for a quiz
exports.fetch_details = (tid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT tid, email, full_name, institute from teachers where tid = ?`
        pool.query(query, [tid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(results.length == 0){
                reject(new Error("no record found"))
            }
            else{
                resolve(results)  
            }
        })
    })
}