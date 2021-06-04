const pool = require("../../config/db_config")

exports.save_allocation = (allocation_map)=>{
    return new Promise((resolve, reject)=>{

        let allocation_string = ""
        allocation_map.forEach((allocation, index) => {
            allocation_string += allocation 
            if(index != allocation_map.length - 1)
                allocation_string += ","
        });
        // console.log(allocation_string)
        // resolve(true)

        //perform query
        let query = `insert into allotment 
            (quizid, sid, qid, attempt_status, student_rating, time_taken) 
            values ` + allocation_string

        pool.query(query, [], (error, results, fields)=>{
            if(!error){
                // console.log(results)
                resolve(results.affectedRows)
            }
            else{
                console.log(`error : ${error}`)
                reject(error)
            }
        })
    })
}