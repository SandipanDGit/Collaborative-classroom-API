const { json } = require("body-parser")
const pool = require("../../../config/db_config")

//returns the list of students entitled for a quiz
exports.students_by_quiz = (quizid)=>{
    return new Promise((resolve, reject)=>{
        let query = `SELECT sid FROM members where cid in (select cid from qb where qbid in (select qbid from quiz where quizid = ?))`
        pool.query(query, [quizid], (error, results)=>{
            if(error){
                reject(error)
            }
            else if(Object.keys(results).length == 0){
                console.log("empty result")
                reject(new Error("no students found"))
            }
            else{
                // console.log("students fetched : ", results)
                resolve(results)  
            }
        })
    })
}