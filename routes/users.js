var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

router.use(bodyParser.json());


router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}), 
    req.body.password, (err, user) => {
    if(err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else {
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      user.save((err,user)=>{
        passport.authenticate('local')(req, res, () => {
          if(err){
            res.statusCode = 500 ;
            res.setHeader('Content-type','application/json');
            res.json({err:err});
            return ;
          }
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({_id : req.user._id});

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token : token,
    status: 'You are successfully logged in!'});
});

/*router.post('/signup',(req,res,next)=>{
  User.findOne({username : req.body.username})
  .then((user)=>{
    if(user != null){
      var err = new Error('Username '+ req.body.username + ' already exists !');
      err.status = 403 ;
      next(err);
    }else{
      User.create({
        username : req.body.username,
        password : req.body.password
      })
      .then((user)=>{
        req.session.user = 'authenticated';
        res.statusCode = 200 ;
        res.setHeader('Content-type', 'application/json');
        res.json({
          status : 'Registration Successful',
          user : user
        });
      },(err)=>next(err))
      .catch((err)=>next(err));
    }
  },(err)=>next(err))
  .catch((err)=>next(err));
});

router.post('/login',(req,res,next)=>{
  if(!req.session.user){
    User.findOne({username : req.body.username})
    .then((user)=>{
      if(user === null){
        var err = new Error('User ' + req.body.username + ' doesn\'t exist !!');
        err.status = 403 ;
        next(err);
      }else if(user.username != req.body.username){
        var err = new Error('User ' + req.body.username + ' username incorrect !!');
        err.status = 403 ;
        next(err);
      }else if(user.password != req.body.password){
        var err = new Error('User ' + req.body.username + ' , password incorrect !!');
        err.status = 403 ;
        next(err);
      }else if(user.username === req.body.username && user.password === req.body.password){
        req.session.user = "authenticated";
        res.statusCode = 200 ;
        res.setHeader('Content-type','text/plain');
        res.end('You are authenticated');
      }
    },(err)=>next(err))
    .catch((err)=>next(err));
  }else if(req.session.user === "authenticated"){
    res.status = 200 ;
    res.setHeader('Content-type','text/plain');
    res.end('You are already logged in');
  }
});*/


router.get('/logout', (req, res,next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
