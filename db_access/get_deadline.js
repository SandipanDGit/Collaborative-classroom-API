const pool = require("../config/db_config")

exports.get_deadline = (qbid)=>{

    return new Promise((resolve, reject)=>{
        // console.log(`qbid = ${qbid}, type = ${typeof(qbid)}`)
        let query = `select contribution_deadline from qb where qbid = ?`

        pool.query(query, [qbid], (error, results, fields)=>{
            if(!error && results.length == 0){
                resolve(0)
            }
            else if(!error){
                resolve(results[0].contribution_deadline)
            }
            else{
                reject(error)
            }
        })
    })
}
