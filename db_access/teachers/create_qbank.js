const pool = require("../../config/db_config")

exports.create_qbank = (qb_data)=>{
    return new Promise((resolve, reject)=>{

        let cid = qb_data.cid
        let qb_title = qb_data.qb_title
        let qb_description = qb_data.qb_description
        let min_contribution = qb_data.min_contribution
        let max_contribution = qb_data.max_contribution
        let contribution_deadline = qb_data.contribution_deadline

        //perform query
        let query = `insert into ${process.env.DB_NAME}.qb (qbid, cid, title, description, created_at, contribution_deadline, min_contribute, max_contribute) values(0, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, ?);`
        pool.query(query, [cid, qb_title, qb_description, contribution_deadline, min_contribution, max_contribution], (error, results)=>{
            if(!error){
                resolve(true)
            }
            else{
                console.log(`error : ${error}`)
                reject(error)
            }
        })
    })
}