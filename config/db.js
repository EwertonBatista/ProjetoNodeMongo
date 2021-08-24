if(process.env.NODE_ENV == "production"){
    module.exports = { mongoURI: "mongodb+srv://EwertonBatista:123321456654@blogapp.bt9hz.mongodb.net/blogapp?retryWrites=true&w=majority" }
}else{
    module.exports = {mongoURI:"mongodb://localhost/blogapp"}
}
