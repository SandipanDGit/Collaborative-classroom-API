const pool = require("../../config/db_config")

exports.student_qb = (qbid, sid) => {
    return new Promise((resolve, reject)=>{
        let query = `select count(*) as count from members where cid in (select cid from qb where qbid = ?) AND sid = ?;`
        pool.query(query, [qbid, sid], (error, results, fields)=>{
            if(!error){

                if(results.length && results[0].hasOwnProperty("count")){
                    resolve(results[0]["count"])
                }
                else{
                    resolve(0)
                }
            }
            else{
                reject(error)
            }
        })
    })
}