const pool = require("../../config/db_config")

exports.create_sample = (sample_data)=>{

    let qbid = sample_data.qbid
    let tid = sample_data.tid
    let question = sample_data.question
    let option1 = sample_data.option1
    let option2 = sample_data.option2
    let option3 = sample_data.option3
    let option4 = sample_data.option4
    let correct_option = sample_data.correct_option
    return new Promise((resolve, reject)=>{
        let query = `insert into sample_questions (quesid, qbid, tid, question_body, option1, option2, option3, option4, correct_option)
        values(0, ?, ?, ?, ?, ?, ?, ?, ?)`

        pool.query(query, [qbid, tid, question, option1, option2, option3, option4, correct_option], (error, results, fields)=>{
            if(!error)
            {
                resolve(results["insertId"])
            }
            else{
                reject(error)
            }
        })
        
    })
}