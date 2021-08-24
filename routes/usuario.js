const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Usuario')
const Usuario = mongoose.model('usuarios')
const bcrypt = require('bcryptjs')
const passport = require('passport')

router.get('/registro',(req, res) => {
    res.render('usuarios/registro')
})

router.post('/registro',(req, res) => {
    var erros = []
    if(!req.body.nome){
        erros.push({
            texto: 'Nome invalido'
        })
    }
    if(!req.body.email){
        erros.push({
            texto: 'email invalido'
        })
    }
    if(!req.body.senha){
        erros.push({
            texto: 'Senha invalida'
        })
    }
    if(req.body.senha.length < 5){
        erros.push({
            texto: 'Senha muito curta'
        })
    }
    if(req.body.senha != req.body.senhaConfirm){
        erros.push({
            texto: 'As senhas são diferentes'
        })
    }
    if(erros.length > 0){
        res.render('usuarios/registro', {
            erros:erros
        })
    } else {
        Usuario.findOne({
            email: req.body.email
        }).then((usuario)=>{
            console.log(usuario)
            if(usuario){
                req.flash('error_msg','Este email já esta cadastrado')
                res.redirect('/usuario/registro')
            }else{
                
                const novoUsuario = new Usuario({
                    nome: req.body.nome,
                    email: req.body.email,
                    senha: req.body.senha
                })

                bcrypt.genSalt(10, (err, salt)=>{
                    bcrypt.hash(novoUsuario.senha, salt, (err, hash)=>{
                        if(err){
                            req.flash('error_msg', 'houve um erro durante o salvamento')
                            res.redirect('/registro')
                        }else{

                            novoUsuario.senha = hash
                            novoUsuario.save().then(()=>{
                                req.flash('success_msg', 'Sucesso no cadastro')
                                res.redirect('/')
                            }).catch((err) => {
                                req.flash('error_msg', 'Erro no cadastro')
                                res.redirect('/usuario/registro')
                            })

                        }
                    })
                })


            }
        }).catch((err)=>{
            req.flash('error_msg', 'houve um erro interno')
            res.redirect('/')
        })
    }
})

router.get('/login', (req, res)=>{
    res.render('usuarios/login')
})

router.post('/login', (req, res, next)=>{
    passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/usuario/login",
        failureFlash: true
    })(req,res,next)
})

router.get('/logout', (req, res)=>{
    req.logout()
    req.flash('success_msg', 'Deslogado com sucesso')
    res.redirect('/')
})

module.exports = router