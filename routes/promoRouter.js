const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

const Promotions = require('../models/promotions');
//for route /promo
promoRouter.route('/')
.get((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','application/json');
    Promotions.find({})
    .then((promotions)=>{
        res.json(promotions);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    Promotions.create(req.body)
    .then((promo)=>{
        console.log('Created promo : \n',promo);
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(promo);
    },(err)=> next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on this url ');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.remove({})
    .then((result)=>{
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// for route /promo/promoid
promoRouter.route('/:promoid')
.get((req,res,next)=>{
    Promotions.findById(req.params.promoid)
    .then((promo)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /promotions/'+ req.params.promoid + ' !');
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoid,{
        $set : req.body
    },{new : true}).then((promo)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(promo);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,  (req,res,next)=>{
    Promotions.findByIdAndRemove(req.params.promoid)
    .then((result)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err))
});
module.exports = promoRouter ;