const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns the list of students entitled for a quiz
exports.allotment_exists = (quizid, sid, qid)=>{
    return new Promise((resolve, reject)=>{
        let query = `select attempt_status from allotment where 
                quizid = ? and sid = ? and qid = ?`
        pool.query(query, [quizid, sid, qid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(Object.keys(results).length == 0){
                console.log(results)
                reject(new Error("no students found"))
            }
            else{
                if(results[0].attempt_status != 0)
                    reject(new Error("allotment updated already"))
                else
                    resolve(true)
            }
        })
    })
}