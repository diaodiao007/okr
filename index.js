var express = require('express');
var nunjucks = require('nunjucks');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var moment = require('moment');

var connection = mysql.createConnection({
    host: '192.168.0.110',
    user: 'root',
    password: '88888888',
    database: 'okr'
});

connection.connect()

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/homepage', function (req, res) {
    res.cookie("test", "value");
    connection.query('select * from okr', function (err, data) {
        var username = req.cookies.username;
        res.render('homepage.html', { okrs: data, username: username });
    })
});

app.get('/details', function (req, res) {
    res.render('details.html')
});

app.get('/personal', function (req, res) {
    var token = req.cookie('token')

    if (!token) {
        return res.json('请先登录')
    }

    connection.query('select *　from user where token=?', [token], function (err, data) {
        if (data.length > 0) {
            var uid = data[0].uid;
            connection.query('select * from okr where uid=?', [uid], function (err, data) {
                res.json(data)
            })
        } else {
            return res.json('token已失效')
        }
    })


    res.render('personal.html')
});

app.post('/api/land', function (req, res) {
    var phone = req.body.phone;
    var password = req.body.password;
    connection.query('select * from user where phone=? and password=? limit 1', [phone, password], function (err, data) {
        if (data.length > 0) {
            
            res.cookie('username',data[0].username)
            res.cookie('uid',data[0].id)
            var token = phone + password + new Date().getTime() + 　Math.random();
            connection.query('update user as t set t.token = ? where phone =?', [token, phone], function (err, data) {
                res.cookie('token', token)
                // res.cookie('pid', data[0].id)
                // res.cookie('phone', data[0].phone)
                res.render('homepage.html')
            });
        }
        else {
            res.send('对不起，用户名或密码错误')
        }
    })
})

app.post('/api/register', function (req, res) {
    var phone = req.body.phone;
    var password = req.body.password;
    var username = phone.substr(0,3)+"****"+phone.substr(7);
    var created_at = moment().format('YYYY-MM-DD HH:mm:ss');

    connection.query('insert into user values (null, ?, ?, ?, "", "", ?)', [phone, password, username, created_at], function (err, data) {
        res.render('homepage.html', { okrs: data });
    })
})


app.post('/api/post', function (req, res) {
    var o = req.body.o;
    var k = req.body.k;
    var r = req.body.r;
    var uid = req.cookies.uid;
    var created_at = moment().format('YYY-MM-DD');
    connection.query('insert into okr values (null, ?,?, ?, ?, ?)', [o, k, r, uid, created_at], function (err, data) {
        res.render('homepage.html')
    })
})


app.listen(3000)