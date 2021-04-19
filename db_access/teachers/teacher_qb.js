const pool = require("../../config/db_config")

exports.teacher_qb = (tid, qbid) => {
    return new Promise((resolve, reject)=>{
        
        let query = `select admin from ${process.env.DB_NAME}.classroom where cid in (select cid from qb where qbid = ${qbid});`
        pool.query(query, [qbid], (error, results, fields)=>{
            if(!error){
                for (let property in results) {
                    if (results.hasOwnProperty(property)) {
                        resolve(results[property]["admin"])
                    }
                }
            }
            else{
                reject(error)
            }
        })
    })
}