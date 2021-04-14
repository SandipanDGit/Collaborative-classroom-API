const pool = require("../config/db_config")

//class admin and class name are mandatory parameters
//rest will be set to NULL if not provided
exports.create_class = (class_data)=>{
    return new Promise((resolve, reject)=>{

        let admin = class_data.admin
        let class_name = class_data.class_name

        // //checking if the key exists and is not undefined (using ternary operator)
        let course = ("course" in class_data && class_data.course)? class_data.course : "NULL"
        let subject = ("subject" in class_data && class_data.subject)? class_data.subject : "NULL"
        let institute = ("institute" in class_data && class_data.institute)? class_data.institute : "NULL"

        //perform query
        let query = `insert into ${process.env.DB_NAME}.classroom (cid, admin, class_name, course, subject, institute) values(0, ?, ?, ?, ?,?);`
        pool.query(query, [admin, class_name, course, subject, institute], (error, results)=>{
            if(!error){
                resolve(true)
            }
            else{
                reject(err)
            }
        })
    })
}