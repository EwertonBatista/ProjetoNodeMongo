// Modulos
    const express = require('express')
    const handlebars = require('express-handlebars')
    const app = express();
    const admin = require('./routes/admin')
    const path = require('path')
    // const mongoose = require('mongoose')

// Configurações

    // Express
        app.use(express.urlencoded({ extended: true}))
        app.use(express.json());
    // HandleBars
        app.engine('handlebars', handlebars({defaultLayout: 'main'}));
        app.set('view engine', 'handlebars');
    // Mongoose

    // Public
        app.use(express.static(path.join(__dirname, 'public')));


// Rotas
    app.use('/admin', admin)

// Outros
const port = 8081
app.listen(port, ()=>{
    console.log('Server rodando na porta: ', port)
})