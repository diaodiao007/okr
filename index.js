var express = require('express');
var nunjucks = require('nunjucks');
var app = express();

nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    express: app,
});

app.get('/personal',function(req,res){
    res.render('personal.html')
});


app.listen(3000)
