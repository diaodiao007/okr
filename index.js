var express = require('express');
var nunjucks = require('nunjucks');
var mysql = require('mysql');
var moment = require('moment');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var app = express();


var connection = mysql.createConnection({
    host: '192.168.0.110',
    user: 'root',
    password: '88888888',
    database: 'okr'
})

connection.connect();

nunjucks.configure('views', {
    autoescape: true,
    noCache: true,
    express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/personal', function (req, res) {
    res.render('personal.html')
});

app.get('/homepage', function (req, res) {

    connection.query(`select * from user`, function (err, data) {
        console.log('data:', data)
        res.render('homepage.html', { items: data })
    })

});

app.post('/api/homepage', function (req, res) {
    var phone = req.body.phone;
    var password = req.body.password;
    var token = req.body.token;
    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');

    console.log(phone,token)

    connection.query('insert into user values (null, ? , ? , "" , "" , ?, ?)', [ phone, password , token ,created_at], function (err, data) {
        res.send('注册成功')
    })
})


app.listen(3000)