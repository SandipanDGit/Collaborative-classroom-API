const pool = require("../config/db_config")
require('dotenv').config()

exports.join_class = ((sid, cid) => {
    return new Promise((resolve, reject) => {
        let query = `insert into ${process.env.DB_NAME}.members (sid, cid) values(?, ?)`
        pool.query(query, [sid, cid], (error, results)=>{
            if(!error) resolve(1)
            else reject(error)
        })
    })
})