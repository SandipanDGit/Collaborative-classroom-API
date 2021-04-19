const pool = require("../../config/db_config")

exports.add_question = (question_data)=>{

    let qbid = question_data.qbid
    let sid = question_data.sid
    let question = question_data.question
    let option1 = question_data.option1
    let option2 = question_data.option2
    let option3 = question_data.option3
    let option4 = question_data.option4
    let correct_option = question_data.correct_option
    return new Promise((resolve, reject)=>{
        let query = `insert into questions (quesid, qbid, sid, question_body, option1, option2, option3, option4, correct_option)
        values(0, ?, ?, ?, ?, ?, ?, ?, ?)`

        pool.query(query, [qbid, sid, question, option1, option2, option3, option4, correct_option], (error, results, fields)=>{
            if(!error)
            {
                resolve(results["insertId"])
            }
            else{
                console.log("query failed")
                reject(error)
            }
        })
        
    })
}