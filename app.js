// Modulos
    const express = require('express')
    const app = express();
    // Handlebars
    const handlebars = require('express-handlebars')
    // Rotas
    const admin = require('./routes/admin')
    const usuario = require('./routes/usuario')

    const path = require('path')
    // Flash & Session
    const session = require('express-session')
    const flash = require('connect-flash')
    // Mongoose
    const mongoose = require('mongoose')
    // Config DB
    const db = require('./config/db')
    // Modulo de Postagem
    require("./models/Postagem")
    const Postagem = mongoose.model("postagens")
    // Modulo de Categoria
    require("./models/Categoria")
    const Categoria = mongoose.model("categorias")
    // Data-fns
    const format = require("date-fns/format");
    const formatDistance = require("date-fns/formatDistance");
    // Autenticação
    passport = require('passport')
    require("./config/auth")(passport)
    


// Configurações
    // Sessão
        app.use(session({
            secret: "cursodenode",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
    // Middleware
        app.use((req,res,next)=>{
            // Variaveis globais
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null
            next()
        })
    // Express
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json());
    // HandleBars

        var hbs = handlebars.create({
            defaultLayout: 'main',
            helpers: {
                formatDataExata: (data)=>{
                    return format(data, 'dd-MM-yyyy')
                },
                formatDataTempo: (data)=>{
                    return formatDistance(data, new Date(), {
                       
                    })
                }
            }
            
        })
            
            
                

        app.engine('handlebars', hbs.engine);
        
        app.set('view engine', 'handlebars');
        
    // Mongoose conexão
        mongoose.Promise = global.Promise;
        mongoose.connect(db.mongoURI,
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

    // PAGINA PRINCIPAL
    app.get('/', (req,res)=>{
        Postagem.find()
        .lean()
        .populate("categoria")
        .sort({data: 'desc'})
        .then((postagens)=>{

            console.log(format(new Date(), 'dd-MM-yyyy'))
            console.log(new Date())
            console.log(postagens.data)

            res.render('index', {
                postagens: postagens,
            })
        })
        .catch(err => {
            req.flash('error_msg', 'Não foi possivel carregar os posts, tente novamente')
            res.redirect('/404')
        })
    })
    // PAGINA DE POSTAGENS
    app.get('/postagem/:slug', (req, res)=>{
        Postagem.findOne({slug: req.params.slug})
        .lean()
        .then((postagem)=>{
            if(postagem){
                res.render('postagem/index', {postagem: postagem})
            }else{
                req.flash('error_msg', 'Postagem não encontrada')
                res.redirect("/")
            }
        }).catch(err => {
            req.flash('error_msg', 'Houve um erro interno')
            res.redirect("/")
        })
    })
    // PAGINA 404
    app.get('/404', (req, res)=>{
        res.send('Error 404 Page not Found, Try again later')
    })

    app.get('/categorias', (req, res)=>{
        Categoria.find()
        .lean()
        .then((categorias)=>{
            let quantidade = categorias.length
            res.render('categoria/index', {categorias: categorias, quantidade: quantidade})

        }).catch((err) => {
            console.log(err)
            req.flash('error_msg', 'Houve um Erro')
            res.redirect('/')
        })
    })

    app.get('/categorias/:slug', (req, res) => {
        Categoria.findOne({
            slug: req.params.slug
        })
        .lean()
        .then((categoria)=>{
            if(categoria){
                Postagem.find({
                    categoria: categoria._id
                }).lean().then((postagens)=>{
                    res.render('categoria/postagem', {
                        postagens: postagens,
                        categoria: categoria
                    })
                }).catch((err)=>{   
                    req.flash('error_msg','Houve um erro ao listar')
                    res.redirect('/')
                })
                
            }else{

                req.flash('error_msg', 'Esta categoria não existe')
                res.redirect('/')

            }
        }).catch((err) => {
            req.flash('error_msg', err)
            res.redirect('/')
        })
    })

    app.use('/admin', admin)
    app.use('/usuario', usuario)

// Outros
const port = process.env.PORT || 8080
app.listen(port, ()=>{
    console.log('Server rodando na porta: ', port, db.mongoURI)
})