const pool = require("../../config/db_config")

exports.rate_question = (rating_data)=>{

    let qbid = rating_data.qbid
    let quesid = rating_data.qid
    let acceptance = rating_data.acceptance
    let rating = rating_data.rating
    

    return new Promise((resolve, reject)=>{
        
        let query = `update questions set acceptance_status = ?, teacher_rating = ? where quesid = ?`
        pool.query(query, [acceptance, rating, quesid], (error, results, fields)=>{
            if(!error && Object.keys(results).length >0 && results["affectedRows"] == 1){
                resolve(1)
            }
            else if(!error){
                reject(new Error("could not update"))
            }
            else{
                reject(error)
            }
        })
    })
}