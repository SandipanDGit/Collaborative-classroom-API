const { json } = require("body-parser")
const pool = require("../../config/db_config")

//returns the list of questions available for a quiz
exports.get_allocations = (sid, quizid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT quesid, question_body, option1, option2, option3, option4, correct_option FROM questions WHERE 
        quesid in (select qid from allotment where sid = ? and quizid = ?)`
        pool.query(query, [sid, quizid], (error, results)=>{
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