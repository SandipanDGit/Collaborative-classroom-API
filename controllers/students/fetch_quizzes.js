const { fetch_quizzes } = require("../../db_access/students/fetch/fetch_quizzes")

exports.fetch_quizzes = (req, res, next)=>{
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

    fetch_quizzes(sid)
    .then(data => {
        res
        .status(200)
        .json({
            status: true,
            info: "student's quizzes fetched",
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