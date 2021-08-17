// Modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const app = express();
    const admin = require('./routes/admin')
    const path = require('path')
    const mongoose = require('mongoose')
    const session = require('express-session')
    const flash = require('connect-flash')

// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())
    // Middleware
        app.use((req,res,next)=>{
            res.locals.success_msg = req.flash("Success_msg")
            res.locals.error_msg = req.flash("Error_msg")
            next();
        })
    // Express
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json());
    // HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // Mongoose conexão
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/blogapp',
         {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        }).then(()=>{
                    console.log(`Conectado ao MongoDB...`)
                }).catch((err)=>{
                    console.log(`Erro ao conectar ${err}`)
        })
    // Public
            app.use(express.static(path.join(__dirname, 'public')));
    
        


// Rotas
    app.use('/admin', admin)

// Outros
const port = 8081
app.listen(port, ()=>{
    console.log('Server rodando na porta: ', port)
})