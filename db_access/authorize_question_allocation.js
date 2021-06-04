const pool = require("../config/db_config")

exports.authorize_question_allocation = (quizid)=>{

    return new Promise((resolve, reject)=>{
        // console.log("inside authorization allocation")
        let query = 
        `select admin from classroom where 
            cid in (select cid from qb where 
                qbid in (SELECT qbid from quiz where quizid = ?)) `

        pool.query(query, [quizid], (error, results, fields)=>{
            //if non empty result returned
            if(!error && results.length){
                // console.log(results[0].admin)
                if(results[0].admin)
                    resolve(results[0].admin)
                // resolve(results[0]["admin"])
            }
            //empty result returned
            else if(Object.keys(results).length == 0){
                reject(new Error("no teacher found for given quiz id"))
            }
            else{   //database error
                reject(error)
            }
        })
    })
}
