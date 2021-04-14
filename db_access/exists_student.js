const { json } = require("body-parser")
const pool = require("../config/db_config")

//returns true if student id exists in students table, otherwise false
exports.exists_student = (id)=>{
    return new Promise((resolve, reject)=>{
        let query = `select count(sid) as count from ${process.env.DB_NAME}.students where sid = ?`
        pool.query(query, [id], (error, results)=>{

            if(error){
                reject(error)
            }
            else if(results[0].count){
                resolve(1)  //exists
            }
            else{
                resolve(0)  //does not exist
            }
        })
    })
}