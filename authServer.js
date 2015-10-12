var express = require('express');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");


var app = express();
app.use(express.static('public'));
//app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    name: 'bla',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
    //maxAge: 5000
  }));
app.use(passport.initialize());
app.use(passport.session());
//app.use(require('router'));

passport.serializeUser(function(user, done) {
  console.log('serializando');
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializando');
  console.log(id);
  User.findById(id, function(err, user) {
    console.log(user);
    done(err, user);
  });
});


passport.use(new LocalStrategy({
    'usernameField': 'username',
    'passwordField': 'password',
    'session': false
},
  function(username, password, done) {
    if("gustavo" == username && "fehse" == password) {
      return done(null, { id: 'gus', username: 'gustavo', emails: ['gfehse@gmail.com']});
    }
    else {
      return done(null, false, {message:'not logged-in'});
    }

  },
  function(err) {
    console.log(err);
  }));


app.post('/login', 
  
  passport.authenticate('local', { 'session': false }),function(req, res) {
    res.json({status:'ok', 'sessionID' : req});
  });

app.get('/', function(req, res, next) {

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