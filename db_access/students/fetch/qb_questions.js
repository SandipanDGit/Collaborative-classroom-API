const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of students entitled for a quiz
exports.qb_questions = (sid, qbid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT concat("1.", quesid) as quesid, question_body from questions 
        WHERE qbid = ? and sid = ? 
        UNION 
        SELECT concat("2.", quesid) as quesid, question_body from sample_questions 
        WHERE qbid = ?`
        pool.query(query, [qbid, sid, qbid], (error, results)=>{
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