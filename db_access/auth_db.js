const pool = require("../config/db_config")

exports.get_user = (email, callback)=>{
    let query = "select email, password from users where email = ?"
    pool.query(query, [email], (error, result, fields)=>{
        query_log = {
            error: error,
            result: result,
            fields: fields
        }
        return callback(query_log)
    })
}

exports.register = (email, hash, callback)=>{
    pool.query("insert into users values(0, ?, ?)", [email, hash], (error, result, fields)=>{
        query_log = {
            error: error,
            result: result,
            fields: fields
        }
        return callback(query_log)
    })
}

