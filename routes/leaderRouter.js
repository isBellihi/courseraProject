const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

const Leaders = require('../models/leaders');
//for route /leader
leaderRouter.route('/')
.get((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','application/json');
    Leaders.find({})
    .then((leaders)=>{
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 200;
    res.setHeader('Content-type','application/json');
    Leaders.create(req.body)
    .then((leader)=>{
        console.log('Created leader : \n',leader);
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(leader);
    },(err)=> next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on this url ');
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Leaders.remove({})
    .then((result)=>{
        res.statusCode = 200; 
        res.setHeader('Content-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// for route /leader/leaderid
leaderRouter.route('/:leaderid')
.get((req,res,next)=>{
    Leaders.findById(req.params.leaderid)
    .then((leader)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /Leaders/'+ req.params.leaderid + ' !');
})
.put(authenticate.verifyUser, (req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderid,{
        $set : req.body
    },{new : true}).then((leader)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Leaders.findByIdAndRemove(req.params.leaderid)
    .then((result)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err))
});
module.exports = leaderRouter ;