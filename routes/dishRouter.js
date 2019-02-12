const express  = require('express');
const bodyParser = require('body-parser');

const DishRouer = express.Router();

DishRouer.use(bodyParser.json());

//for route /dish
DishRouer.route('/')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.write('We will send all dishes to you!');
    res.end();
})
.post((req,res,next)=>{
    res.end('We will add dish ' + req.body.name + ' with details ' + req.body.description);
})
.put((req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on this url ');
})
.delete((req,res,next)=>{
    res.end('Deleting all dishes!');
});

// for route /dish/dishid
DishRouer.route('/:dishid')
.all((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','text/plain');
    next();
})
.get((req,res,next)=>{
    res.write('We will send to you the dish ' + req.params.dishid + ' !');
    res.end();
})
.post((req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /dish/'+ req.params.dishid + ' !');
})
.put((req,res,next)=>{
    res.end('We will edit the dish '+ req.params.dishid + ' !');
})
.delete((req,res,next)=>{
    res.end('Deleting the dishe '+ req.params.dishid + ' :');
});

module.exports = DishRouer;