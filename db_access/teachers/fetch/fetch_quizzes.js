const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of students entitled for a quiz
exports.fetch_quizzes = (tid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT * from quiz where qbid in 
            (select qbid from qb where cid in 
                (select cid from classroom where admin = ?))`
        pool.query(query, [tid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(results.length == 0){
                reject(new Error("no quizzes found"))
            }
            else{
                resolve(results)  
            }
        })
    })
}