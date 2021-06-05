const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns the list of students entitled for a quiz
exports.submit_response = (response_data)=>{
    return new Promise((resolve, reject)=>{
        let query = `update allotment set attempt_status = ?, response = ?, time_taken = ?
            where quizid = ? and sid = ? and qid = ?`
        pool.query(query, 
            [
                response_data.attempt_status, 
                response_data.response,
                response_data.time_taken,
                response_data.quizid,
                response_data.sid,
                response_data.qid
            ], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(Object.keys(results).length == 0){
                console.log(results)
                reject(new Error("response could not be updated"))
            }
            else{
                resolve(true)
            }
        })
    })
}