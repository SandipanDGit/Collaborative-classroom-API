const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of questions available for a quiz
exports.questions_by_quiz = (quizid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT * FROM questions WHERE 
        qbid in (select qbid from quiz where quizid = ?)`
        //acceptance_status = "accepted" 
        pool.query(query, [quizid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(Object.keys(results).length == 0){
                console.log("empty result")
                reject(new Error("no students found"))
            }
            else{
                // console.log("questions fetched : ", results)
                resolve(results)  
            }
        })
    })
}