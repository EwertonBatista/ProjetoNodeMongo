module.exports = {
    eAdmin(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }
        res.render('index', {
            deslogado: true
        })
    }
}