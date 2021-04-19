const pool = require("../../config/db_config")

exports.create_quiz = (quiz_data)=>{

    let qbid = quiz_data.qbid
    let duration = quiz_data.duration
    let marks_per_q = quiz_data.marks_per_q
    let start_time = quiz_data.start_time
    let instructions = quiz_data.instructions

    return new Promise((resolve, reject)=>{
        let query = `insert into quiz (quizid, qbid, duration, marks_per_q, start_time, instruction)
        values(0, ?, ?, ?, ?, ?)`

        console.log(Date.now())
        console.log(`user input : ${quiz_data.start_time}`)
        pool.query(query, [qbid, duration, marks_per_q, start_time, instructions], (error, results, fields)=>{
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