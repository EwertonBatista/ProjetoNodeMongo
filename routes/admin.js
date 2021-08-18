const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
require("../models/Categoria");
const Categoria = mongoose.model("categorias");
const format = require('date-fns/format')
const formatDistance = require('date-fns/formatDistance')

router.get("/", (req, res) => {
  res.render("admin/index");
});

router.get("/posts", (req, res) => {
  res.send("pagina de posts");
});


// LISTANDO CATEGORIAS 
router.get("/categorias", (req, res) => {


  Categoria.find().sort({date:'desc'}).lean()
  .then((categoria)=>{

    // var dataFormatada = formatDistance((categoria[0].date), new Date());
    // console.log(dataFormatada);
    
    // TENTANDO IMPLEMENTAR DATA FORMATADA
    categoria.forEach((date)=>{
        console.log(formatDistance(date, new Date()));

    })
    
    res.render("admin/categorias", {
        categoria: categoria,
    })
  }).catch((err) => {
    req.flash('error_msg', 'Houve um erro ao listar as categorias')
    res.redirect('/admin')
      
  })
});


// ADICIONAR CATEGORIAS
router.get("/categorias/add", (req, res) => {
  res.render("admin/addcategorias");
});


// VALIDANDO E SALVANDO NO BANCO DE DADOS
router.post("/categorias/nova", (req, res) => {
 
    var erros = [];

// VALIDAÇÃO MANUAL
  if (
    !req.body.nome ||
    typeof req.body.nome == undefined ||
    req.body.nome == null
  ) {
    erros.push({
      texto: "Nome invalido",
    });
  }

  if (
    !req.body.slug ||
    typeof req.body.slug == undefined ||
    req.body.slug == null
  ) {
    erros.push({
      texto: "slug invalido",
    });
  }

  if (req.body.nome.length < 2) {
    erros.push({
      texto: "Numero de caracteres invalidos, tente mais de 2",
    });
  }

  if (erros.length > 0) {
    res.render("admin/addcategorias", {
      erros: erros,
    });
  } else {
    let nome = req.body.nome;
    let slug = req.body.slug.toLowerCase().replace(/( )+/g, "-");

    const novaCategoria = {
      nome: nome,
      slug: slug,
    };

// SALVANDO DADOS
    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash('success_msg', 'Categoria criada com sucesso');
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash('error_msg', 'Erro ao criar categoria');
        res.redirect("/admin");
      });
  }
});

module.exports = router;
