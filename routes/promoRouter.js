const express = require('express');
const bodyParser = require('body-parser');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text-plain');
    next();
})
.get((req,res,next)=>{
    res.end('We will send all promotions to you !');
})
.post((req,res,next)=>{
    res.end('We will add new promo '+ req.body.name + ' with details ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403 ;
    res.end('PUT Operation not supported on /promotions ! ')
})
.delete((req,res,next)=>{
    res.end('Deleting all promotions !');
});

promoRouter.route('/:promoid')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text-plain');
    next();
})
.get((req,res,next)=>{
    res.end('We will send promotion ' + req.params.promoid + ' to you !');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('POST not supported on this route');
})
.put((req,res,next)=>{
    res.end('Editing the promotion ' + req.params.promoid + 
    ' with details: name =  '+ req.body.name + ' and description = ' + req.body.description + ' !') ;
})
.delete((req,res,next)=>{
    res.end('Deleting promotion ' + req.params.promoid + ' !');
});
module.exports = promoRouter ;