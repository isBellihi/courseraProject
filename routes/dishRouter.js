const express  = require('express');
const bodyParser = require('body-parser');
const DishRouer = express.Router();

const authenticate = require('../authenticate');

DishRouer.use(bodyParser.json());

const Dishes = require('../models/dishes');
//for route /dish
DishRouer.route('/')
.get((req,res,next)=>{
    res.statusCode = 200 ;
    res.setHeader('Content-type','application/json');
    Dishes.find({})
    .populate('comments.author')
    .then((dishes)=>{
        res.json(dishes);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
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
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on this url ');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
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
    .populate('comments.author')
    .then((dish)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /dish/'+ req.params.dishid + ' !');
})
.put(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishid,{
        $set : req.body
    },{new : true}).then((dish)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(dish);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndRemove(req.params.dishid)
    .then((result)=>{
        res.statusCode = 200 ;
        res.setHeader('Contenet-type','application/json');
        res.json(result);
    },(err)=>next(err))
    .catch((err)=>next(err))
});


//Comments Part

DishRouer.route('/:dishid/comments')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null){
            res.statusCode = 200 ;
            res.setHeader('Content-type','application/json');
            res.json(dish.comments);
        }else{
            err = new Error("Dish " + req.params.dishid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .then((dish)=>{
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish)=>{
                        res.statusCode = 200 ;
                        res.setHeader('Content-type','application/json');
                        res.json(dish);
                    });
            },(err)=>next(err));        }else{
            err = new Error("Dish " + req.params.dishid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403
    res.end('Put operation not supported on /dishes/' + req.params.dishid + '/comments');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .then((dish)=>{
        if(dish != null){
            /*for(var i=0;i<dish.comments.length;i++){
                dish.comments.id(dish.comments[i]._id).remove();
            }*/
            for (var i = (dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish)=>{
                res.statusCode = 200 ;
                res.setHeader('Content-type','application/json');
                res.json(dish);
            },(err)=>next(err));
        }else{
            err = new Error("Dish " + req.params.dishid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

// for route /dish/dishid
DishRouer.route('/:dishid/comments/:commentid')
.get((req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish)=>{
        if(dish != null && dish.comments.id(req.params.commentid) != null){
                res.statusCode = 200 ;
                res.setHeader('Content-type','application/json');
                res.json(dish.comments.id(req.params.commentid));
        }else if(dish==null){
            err = new Error("Dish " + req.params.dishid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }else{
            err = new Error("Comment " + req.params.commentid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403
    res.end('Post operation not supported on /dish/'+ req.params.dishid + '/comments/' + req.params.commentid + ' !');
})
.put(authenticate.verifyUser,(req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish)=>{
        if(!dish.comments.id(req.params.commentid).author._id.equals(req.user._id)){
            var err = new Error("You are not authorized to perform this operation! put only for owner of the comments!!");
            err.status = 403;
            return next(err);
        }
        if(dish != null && dish.comments.id(req.params.commentid) != null){
            if(req.body.rating){
                dish.comments.id(req.params.commentid).rating = req.body.rating ;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentid).comment = req.body.comment ;
            }
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode = 200 ;
                    res.setHeader('Content-type','application/json');
                    res.json(dish);
                });
            },(err)=>next(err));
        }else if(dish==null){
            err = new Error("Dish " + req.params.dishid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }else{
            err = new Error("Comment " + req.params.commentid + " not found");
            res.statusCode = 404 ;
            return next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.delete(authenticate.verifyUser, (req,res,next)=>{
    Dishes.findById(req.params.dishid)
    .then((dish)=>{
        if(!dish.comments.id(req.params.commentid).author._id.equals(req.user._id)){
            var err = new Error("You are not authorized to perform this operation! delete only for owner of the comments!!");
            err.status = 403;
            return next(err);
        }
        if(dish != null && dish.comments.id(req.params.commentid) != null){
            dish.comments.id(req.params.commentid).remove();
            dish.save()
            .then((dish)=>{
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish)=>{
                    res.statusCode = 200 ;
                    res.setHeader('Content-type' , 'application/json');
                    res.json(dish);
                })
                .catch((err)=>next(err));
            },(err)=>next(err));
        }else if(dish == null){
            err = new Error('Dish ' + req.params.dishid + ' not found !!');
            next(err);
        }else{
            err = new Error('Comment '+ req.params.commentid + ' not found !!');
            next(err);
        }
    },(err)=>next(err))
    .catch((err)=>next(err));
});

module.exports = DishRouer;