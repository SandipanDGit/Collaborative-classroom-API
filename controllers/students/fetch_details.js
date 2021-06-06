const { fetch_details } = require("../../db_access/students/fetch/fetch_details")

exports.fetch_details = (req, res, next)=>{
    if(!res.locals.authenticated){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authenticated"
        })
        return
    }
    //authorize role of user as student
    if(res.locals.user.role !== "student"){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authorized as student"
        })
        return
    }

    //get sid from auth credentials
    let sid = res.locals.user.id

    fetch_details(sid)
    .then(data => {
        res
        .status(200)
        .json({
            status: true,
            info: "student details fetched",
            data: data
        })
        return
    })
    .catch(error=>{
        res
        .status(500)
        .json({
            status: false,
            info: error.message
        })
    })
}