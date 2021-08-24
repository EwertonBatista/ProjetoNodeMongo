// Express e Router
const express = require("express");
const router = express.Router();

// Mongoose
const mongoose = require("mongoose");

// Helper
  const {eAdmin} = require("../helpers/eAdmin")

// Models

  // Model - Categoria
  require("../models/Categoria");
  const Categoria = mongoose.model("categorias");
  // Model - Postagem
  require("../models/Postagem");
  const Postagem = mongoose.model("postagens");

// Data:
const format = require("date-fns/format");
const formatDistance = require("date-fns/formatDistance");

router.get("/", (req, res) => {
  res.render("admin/index");
});



// ****************************** CATEGORIAS ******************************

// LISTANDO CATEGORIAS
router.get("/categorias", eAdmin, (req, res) => {
  Categoria.find()
    .sort({ date: "desc" })
    .lean()
    .then((categoria) => {


      // let dataAgora = new Date()
      // categoria.forEach((categoria)=>{
      //   console.log(`logando com mongo ${categoria.date}`)
      // })  
      // console.log(dataAgora)
      // console.log(format(dataAgora, 'dd-MM-yyyy'))

      res.render("admin/categorias", {
        categoria: categoria
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Houve um erro ao listar as categorias");
      res.redirect("/admin");
    });
});

// ADICIONAR CATEGORIAS
router.get("/categorias/add", eAdmin, (req, res) => {
  res.render("admin/addcategorias");
});

// EDITANDO CATEGORIAS
router.get("/categorias/edit/:id", eAdmin, (req, res) => {
  Categoria.findOne({
    _id: req.params.id,
  })
    .lean()
    .then((categoria) => {
      res.render("admin/editCategorias", {
        categoria: categoria,
      });
    })
    .catch((err) => {
      req.flash("error_msg", "Categoria invalida");
      res.redirect("/admin/categorias");
    });
});

// DELETANDO CATEGORIAS
router.post("/categorias/deletar", eAdmin, (req, res) => {
  Categoria.deleteOne({
    _id: req.body.id,
  })
    .then((categoria) => {
      req.flash("success_msg", "Deletado com sucesso");
      res.redirect("/admin/categorias");
    })
    .catch((err) => {
      req.flash("error_msg", "Erro ao deletar");
      res.redirect("/admin/categorias");
    });
});

// SALVANDO EDIÇÃO DE CATEGORIAS
router.post("/categorias/edit", eAdmin, (req, res) => {
  var erros = [];

  if (!req.body.nome) {
    erros.push({
      texto: "Nome invalido",
    });
  }

  if (!req.body.slug) {
    erros.push({
      texto: "Slug invalido",
    });
  }

  if (req.body.nome.length < 3) {
    erros.push({
      texto: "Numero de caracteres do nome invalido, tente mais de 2",
    });
  }

  if (req.body.slug.length < 3) {
    erros.push({
      texto: "Numero de caracteres do slug invalido, tente mais de 2",
    });
  }

  if (erros.length > 0) {
    req.flash("error_msg", "Erro no processo");
    res.redirect("/admin/categorias");
  } else {
    Categoria.findOne({
      _id: req.body.id, 
    })
      .then((categoria) => {
        categoria.nome = req.body.nome;
        categoria.slug = req.body.slug.replace(/( )+/g, "-");

        categoria
          .save()
          .then(() => {
            req.flash("success_msg", "Sucesso ao salvar");
            res.redirect("/admin/categorias");
          })
          .catch((err) => {
            req.flash("error_msg", "Erro ao salvar");
            res.redirect("/admin/categorias");
          });
      })
      .catch((err) => {
        req.flash("error_msg", "Houve erro ao editar" + err);
        res.redirect("/admin/categorias");
      });
  }
});

// VALIDANDO E SALVANDO NO BANCO DE DADOS
router.post("/categorias/nova", eAdmin, (req, res) => {
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
    let slug = req.body.slug.replace(/( )+/g, "-");

    const novaCategoria = {
      nome: nome,
      slug: slug,
    };

    // SALVANDO DADOS
    new Categoria(novaCategoria)
      .save()
      .then(() => {
        req.flash("success_msg", "Categoria criada com sucesso");
        res.redirect("/admin/categorias");
      })
      .catch((err) => {
        req.flash("error_msg", "Erro ao criar categoria");
        res.redirect("/admin");
      });
  }
});



// **************************** POSTAGENS *************************************


// Listando postagens
router.get("/postagens", eAdmin,(req, res) => {
  Postagem.find()
  .populate("categoria")
  .sort({data: 'desc'})
  .lean()
  .then((postagens) => {
    res.render('admin/postagens', {
      postagens: postagens
    })
  })
  .catch(()=>{
    req.flash('error_msg', 'Erro ao listar postagens')
    res.redirect('/admin')
  })
});

// Adicionando nova postagem
router.get("/postagens/add", eAdmin,(req, res) => {
  Categoria.find().lean()
  .then((categorias) => {
    res.render("admin/addpostagens", {
      categorias: categorias
    })
  }).catch((err) => {
    req.flash("error", "Erro ao listar" + err)
  })

})

// Salvando nova postagem no Banco de DADOS

router.post("/postagens/nova", eAdmin,(req, res)=> {

    var erros = []

    if(req.body.categoria == "0"){
      erros.push({
        texto: "Categoria invalida, selecione ou registre uma categoria"
      })
    }

    if(erros.length > 0){
      res.render("admin/addpostagens", {
        erros: erros
      })
    } else {
      const novaPostagem = {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        conteudo: req.body.conteudo,
        categoria: req.body.categoria,
        slug: req.body.slug.replace(/( )+/g, "-")
      }

      new Postagem(novaPostagem).save()
      .then(()=>{
        req.flash('success_msg', 'Postagem criada com sucesso!')
        res.redirect('/admin/postagens')
      })
      .catch(()=>{
        req.flash('error_msg', 'Erro ao criar postagem')
        res.redirect('/admin/postagens')
      })

    }

})

// Editando postagem

router.get("/postagens/edit/:id", eAdmin,(req, res)=>{

  Postagem.findOne({_id: req.params.id})
  .lean()
    .then((postagem)=>{
      Categoria.find()
        .lean()
        .then((categorias)=>{
          res.render("admin/editpostagens", {
            categorias: categorias,
            postagem: postagem
          })
        
        })
        .catch((err)=>{
          req.flash('error_msg', 'Houve um erro ao listar as categorias')
          res.redirect('/admin/postagens')
        })

      })
    .catch(()=>{
      req.flash('error_msg', 'Houve um erro ao carregar formulário de edição')
      res.redirect('/admin/postagens')
    })

})

// Salvando Edição Postagem

router.post("/postagens/edit", eAdmin,(req,res)=>{

  Postagem.findOne({_id: req.body.id})
  .then((postagem)=>{

    postagem.titulo = req.body.titulo,
    postagem.slug = req.body.slug,
    postagem.descricao = req.body.descricao,
    postagem.conteudo = req.body.conteudo,
    postagem.categoria = req.body.categoria

    postagem.save().then(()=>{
      req.flash('success_msg', 'Postagem editada com sucesso')
      res.redirect('/admin/postagens')
    }).catch(()=>{
      req.flash('error_msg', 'Erro ao salvar edição')
      res.redirect('/admin/postagens')
    })

  }).catch((err)=>{
    console.log(err)
    req.flash('error_msg', 'Erro ao listar edição')
    res.redirect('/admin/postagens')
  })

})

// Deletando Postagem

router.post("/postagens/deletar", eAdmin,(req,res) => {
    Postagem.deleteOne({
      _id: req.body.id
    }).then(()=>{
      req.flash('success_msg', 'Postagem deletada com sucesso')
      res.redirect('/admin/postagens')
    }).catch(err => {
      req.flash('error_msg', 'Erro ao deletar postagem')
      res.redirect('/admin/postagens')
    })
})


module.exports = router;
