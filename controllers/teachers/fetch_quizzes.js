const { fetch_quizzes } = require("../../db_access/teachers/fetch/fetch_quizzes")

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
    //authorize role of user as teacher
    if(res.locals.user.role !== "teacher"){
        res
        .status(400)
        .json({
            status: false,
            info: "user not authorized as teacher"
        })
        return
    }

    //get tid from auth credentials
    let tid = res.locals.user.id

    fetch_quizzes(tid)
    .then(data => {
        res
        .status(200)
        .json({
            status: true,
            info: "teacher's quizzes fetched",
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