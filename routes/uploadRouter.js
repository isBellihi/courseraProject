const express  = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb /**callback function */)=>{
        cb(null,'public/images');
    },
    filename: (req,file,cb /** callback function */)=>{
        cb(null, file.originalname)
    }
});

const imageFileFilter = (req,file,cb/**callback function */)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('You can upload only image files!',false));
    }
    cb(null,true);
};

const upload = multer({storage:storage,fileFilter: imageFileFilter});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());


uploadRouter.route('/')
.put(authenticate.verifyUser,authenticate.verifyAdmin, 
    (req,res,next)=>{
    res.statusCode = 403;
    res.end('Put operation not supported on this /imageUpload ');
})
.post(authenticate.verifyUser,authenticate.verifyAdmin, 
    upload.single('imageFile'),(req,res)=>{
        res.statusCode = 200 ;
        res.setHeader('Content-type','application/json');
        res.json(req.file);
})
.get(authenticate.verifyUser,authenticate.verifyAdmin, 
    (req,res,next)=>{
    res.statusCode = 403;
    res.end('get operation not supported on this /imageUpload ');
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin, 
    (req,res,next)=>{
    res.statusCode = 403;
    res.end('delete operation not supported on this /imageUpload ');
});

module.exports = uploadRouter;