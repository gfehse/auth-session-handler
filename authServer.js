var express = require('express');
var session = require('express-session');
var passport = require('passport');
var Strategy = require('passport-http').BasicStrategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");


var app = express();
app.use(express.static('public'));
app.use(cookieParser());
//app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    maxAge: 5000
  }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(require('router'));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


passport.use(new Strategy(
  function(username, password, done) {

    if("gustavo" == username && "fehse" == password) {
      return done(null, { id: 'gus', username: 'gustavo', emails: ['gfehse@gmail.com']});
    }
    else {
      return done(null, false, {message:'not logged-in'});
    }

  }));


app.get('/login',
  passport.authenticate('basic', { session: false }),
  function(req, res) {

    res.redirect("/");
    //res.json({ id: req.user.id, username: req.user.username });
  });


app.get('/', function(req, res) {

  //response.writeHead(200, { 'Content-Type': 'application/json' });
  console.log(req.user);
  if(req.user) {
    res.write('You are logged-in');
  }
  else {
    res.write('Login failed');
  }
  res.end();

});

app.listen(3000);