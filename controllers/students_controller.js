dashboard = (req, res, next)=>{
    if(res.locals.authenticated){
        res
        .status(200)
        .json({
            status : true,
            info : `${res.locals.user.email} allowed access to students/dashboard`
        })
    }
    else{
        res
        .status(400)
        .json({
            status : false,
            info : "token not verified"
        })
    }
}

module.exports = dashboard