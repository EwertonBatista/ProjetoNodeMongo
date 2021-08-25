const mongoose = require('mongoose')
require('../models/Postagem')
const Postagem = mongoose.model('postagens')

module.exports = {
    eAdmin(req,res,next){
        if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next()
        }


        Postagem.find()
        .lean()
        .populate("categoria")
        .sort({data: 'desc'})
        .then((postagens)=>{

                res.render('index', {
                    postagens: postagens,
                    deslogado: true
                })
            })





    }



}