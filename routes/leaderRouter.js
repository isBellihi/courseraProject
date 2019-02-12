const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text-plain');
    next();
})
.get((req,res,next)=>{
    res.end('We will send all leaders to you !');
})
.post((req,res,next)=>{
    res.end('We will add new leader '+ req.body.name + ' with details ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403 ;
    res.end('PUT Operation not supported on /leaders ! ')
})
.delete((req,res,next)=>{
    res.end('Deleting all leaders !');
});

leaderRouter.route('/:leaderid')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text-plain');
    next();
})
.get((req,res,next)=>{
    res.end('We will send leadertion ' + req.params.leaderid + ' to you !');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST not supported on this route');
})
.put((req,res,next)=>{
    res.end('Editing the leadertion ' + req.params.leaderid + 
    ' with details: name =  '+ req.body.name + ' and description = ' + req.body.description + ' !') ;
})
.delete((req,res,next)=>{
    res.end('Deleting leadertion ' + req.params.leaderid + ' !');
});

module.exports = leaderRouter ;