const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns the list of students entitled for a quiz
exports.rating_exists = (quizid, sid, qid)=>{
    return new Promise((resolve, reject)=>{
        let query = `select student_rating from allotment where 
                quizid = ? and sid = ? and qid = ?`
        pool.query(query, [quizid, sid, qid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(results.length == 0){
                reject(new Error("no question allocation found with given data"))
            }
            else{
                if(results[0].student_rating != 0){
                    reject(new Error("student_rating updated already"))
                }else
                    resolve(true)
            }
        })
    })
}