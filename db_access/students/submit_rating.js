const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns the list of students entitled for a quiz
exports.submit_rating = (rating_data)=>{
    return new Promise((resolve, reject)=>{
        let query = `update allotment set student_rating = ? where quizid = ? and sid = ? and qid = ?`
        pool.query(query, [rating_data.rating, rating_data.quizid, rating_data.sid, rating_data.qid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(Object.keys(results).length == 0){
                reject(new Error("rating could not be updated"))
            }
            else{
                resolve(true)
            }
        })
    })
}