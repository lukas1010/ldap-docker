var express = require('express');
var path = require('path');
var multipart = require('connect-multiparty');
var bodyParser = require('body-parser');
var session = require('express-session');
var expressJwt = require('express-jwt');

var app = express();

var serverConfig = require('./config/server');
var jwtParser = require('./middlewares/jwt-parser');
var errorHandler = require('./middlewares/error-handler');

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    next();
};

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname , "./../client/")));
// app.use(jwtParser.parser());
app.use(multipart());
app.use(allowCrossDomain);
app.use(session({secret: serverConfig.secret, resave:false, saveUninitialized: true}));

app.use(serverConfig.BASE_URL, expressJwt({secret: serverConfig.secret}).unless({
	path: [serverConfig.BASE_URL+'/auth/login',serverConfig.BASE_URL+'/auth/token']
}));


app.use(serverConfig.BASE_URL + '/auth', require('./routes/auth')());
app.use(serverConfig.BASE_URL + '/user', require('./routes/users')());

app.use(errorHandler.errorHandler());

app.listen(serverConfig.PORT);

console.log("Server is listening on port " + serverConfig.PORT);