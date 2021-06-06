const { qb_questions } = require("../../db_access/students/fetch/qb_questions")
const { student_qb } = require("../../db_access/students/student_qb")

exports.qb_questions = (req, res, next)=>{
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

    //validate request data
    if(!req.body.hasOwnProperty("qbid") || !req.body.qbid || typeof(req.body.qbid) != 'number'){
        res.status(400).json({ status: false, info: "question bank id(qbid) missing or invalid"})
    }

    //get sid from auth credentials
    let sid = res.locals.user.id

    //get qbid from req.body
    let qbid = req.body.qbid

    //check if student is entitled to qb with given qbid
    student_qb(qbid, sid)
    .then(data => {
        if(data == 0){
            res
            .status(400)
            .json({
                status: false,
                info: "student not entitled to the question bank"
            })
            return
        }

      return qb_questions(sid, qbid)
    })
    .then(data => {
        res
        .status(200)
        .json({
            status: true,
            info: "questions fetched",
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