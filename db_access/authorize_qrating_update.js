const pool = require("../config/db_config")

exports.authorize_qrating_update = (qid)=>{

    return new Promise((resolve, reject)=>{
        // console.log("inside authorization")
        let query = 
        `select admin from classroom 
            where cid = (select cid from qb 
                where qbid = (select qbid from questions 
                    where quesid = ? and teacher_rating IS NULL and acceptance_status = "pending"))`

        pool.query(query, [qid], (error, results, fields)=>{
            //if non empty result returned
            if(!error && results.length){
                resolve(results[0]["admin"])
            }
            //empty result returned
            else if(Object.keys(results).length == 0){
                reject(new Error("question id updated before or tid unauthorized"))
            }
            else{   //database error
                reject(error)
            }
        })
    })
}
