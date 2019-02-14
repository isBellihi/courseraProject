const express  = require('express');
const bodyParser = require('body-parser');
const DishRouer = express.Router();

DishRouer.use(bodyParser.json());

const Dishes = require('../models/dishes');
//for route /dish
DishRouer.route('/')
.get((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','application/json');
    Dishes.find({})
    .then((dishes)=>{
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    Dishes.create(req.body)
    .then((dish)=>{
        console.log('Created Dish : \n',dish);
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(dish);
    },(err)=> next(err))
    .catch((err)=>next(err));
})
.put((req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on this url ');
})
.delete((req,res,next)=>{
    Dishes.remove({})
    .then((result)=>{
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// for route /dish/dishid
DishRouer.route('/:dishid')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .then((dish)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post((req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /dish/'+ req.params.dishid + ' !');
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishid,{
        $set : req.body
    },{new : true}).then((dish)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete((req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishid)
    .then((result)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports = DishRouer;