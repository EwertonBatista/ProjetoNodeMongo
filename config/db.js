if(process.env.NODE_ENV == "production"){
    module.exports = {mongoURI:"mongodb+srv://EwertonBatista:24071998aA@blogapp.bt9hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"}
}else{
    module.exports = {mongoURI:"mongodb://localhost/blogapp"}
}