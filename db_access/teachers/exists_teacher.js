const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns true if teacher id exists in teachers table, otherwise false
exports.exists_teacher = (id)=>{
    return new Promise((resolve, reject)=>{
        let query = `select count(tid) as count from ${process.env.DB_NAME}.teachers where tid = ?`
        pool.query(query, [id], (error, results)=>{

            if(error){
                reject(error)
            }
            else if(results[0].count){
                resolve(1)  //exists
            }
            else{
                resolve(0)  //doesn't exist
            }
        })
    })
}