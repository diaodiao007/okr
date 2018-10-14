var express = require('C:/Users/Administrator/AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/express');
var app = express();

app.get('/',function(req,res){
    res.send('hello okr')
});


app.listen(3000)