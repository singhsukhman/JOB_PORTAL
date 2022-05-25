const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)
const {userController, jobController}  = require('../api/index')
const express = require('express')
const { required } = require('joi')
const router = express.Router()

//
router.post('/signup' ,(req, res, next) =>{
    // console.log(req.body);
    const userRoute = joi.object().keys({
        FirstName : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/).min(3).max(20).required(),
        LastName : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/).min(3).max(20).required(),
        Email : joi.string().trim(true).email().required(),
        Password : joi.string().min(6).trim(true).required(),
        ConfirmPassword :  joi.string().valid(joi.ref('Password')).required(),
        Phone : joi.number().required(),
        Gender : joi.string().valid("M","F","O"),
        Country : joi.string().required(),
        Description : joi.string(),
        Skills :  joi.object().keys({
            Professional_Skills: joi.array(),
            Training_Intership: joi.array()
             }).required(),
        Education : joi.array().items({
            Tenth: joi.string(),
            Twelve: joi.string(),
            Graduation: joi.string().trim().optional().allow("", null),
            Post_Graduation: joi.string().optional().allow("", null),
        }),
        CurrentCompany : joi.string().required()
    })
    const {error} = userRoute.validate(req.body) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, userController.SignupUser)



///Login
router.post('/login',(req, res, next) =>{
    // if (!(req.body.Email && req.body.Password)) {
    //     return res.status(400).send({ error: "Data not formatted properly" });
    //   }
   const Emailvalid = joi.object().keys({
    Email : joi.string().required().trim(true).email(),
    Password : joi.string().trim(true).required(),
   })
   const {error} = Emailvalid.validate(req.body) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, userController.loginUser )

////////// get all users
router.route('/')
.get(userController.getUser);




//<<<<<<<<<<<<<<<<----------------------ORG Forget password-------------------------->>>>>>>>>>>> 

router.post('/forget_pass',(req, res, next) =>{
    const Emailvalid = joi.object().keys({
        Email : joi.string().required().trim(true).email()
       })
       const {error} = Emailvalid.validate(req.body) 
        if(error){
            res.status(404).send(error.message) 
            return
        }
        next();
}, userController.forgetPass)


 
//<<<<<<<<<<<<<<---------------------Reset Password------------------------------>>>>>>>>>>>>>>>>>
router.post('/reset_pass/:id/:token',(req, res, next) =>{
    const Emailvalid = joi.object().keys({
        Email : joi.string().required().trim(true).email(),
        Password : joi.string().trim(true).required(),
        ConfirmPassword :  joi.any().valid(joi.ref('Password')).required()
       })
       const {error} = Emailvalid.validate(req.body) 
        if(error){
            res.status(404).send(error.message)
            return
        }
        next();
}, userController.resetPass)


//<<<<<<<-------------Get One user------------->>>>>>>>>>>>>

router.get('/:id',(req, res, next) =>{
    const Idvalidate = joi.object({
     id: joi.objectId(), 
    })
    const {error} = Idvalidate.validate(req.params)
     if(error){
         res.status(404).send(error.message)
         return
     }
     next();
 }, userController.getOneUser )

//<<<<<<<<<<<<<<---------------------Update One User--------->>>>>>>>>>>>>>>

router.patch('/:id' ,(req, res, next) =>{
    // console.log(req.body);
    const userRoute = joi.object().keys({
        id: joi.objectId(),
        FirstName : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/).min(3).max(20),
        LastName : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/).min(3).max(20),
        Email : joi.string().trim(true).email(),
        Password : joi.string().min(6).trim(true),
        Phone : joi.number(),
        Gender : joi.string().valid("M","F","O"),
        Country : joi.string(),
        Description : joi.string(),
        Skills :  joi.object().keys({
            Professional_Skills: joi.array(),
            Training_Intership: joi.array()
             }),
        Education : joi.array().items({
                Tenth: joi.string(),
                Twelve: joi.string(),
                Graduation: joi.string().trim().optional().allow("", null),
                Post_Graduation: joi.string().optional().allow("", null),
            }),

        CurrentCompany : joi.string() 
    })
    const {error} = userRoute.validate(req.body  || req.params) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, userController.updateOneUser)


//<<<<<<<<<<<<<<<<<<<<<<<< update User education>>>>>>>>>>>>>>>>>>>>>>>>>>. 



router.patch('/updateEdu/User_id=:id/Edu_id=:id2',(req, res, next) =>{
    const userRoute = joi.object().keys({
    Education : joi.array().items({
        Tenth: joi.string(),
        Twelve: joi.string(),
        Graduation: joi.string().trim().optional().allow("", null),
        Post_Graduation: joi.string().optional().allow("", null),
    }),  
   })
    const {error} = userRoute.validate(req.body) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
} ,userController.updateEdu);


//<<<<<<<<<<<<<<<<<<<<<<<< update User Skiils>>>>>>>>>>>>>>>>>>>>>>>>>>. 



router.patch('/updateSkills/User_id=:id',(req, res, next) =>{
    const userRoute = joi.object().keys({
        Skills :  joi.object().keys({
            Professional_Skills: joi.array(),
            Training_Intership: joi.array()
             })  
   })
    const {error} = userRoute.validate(req.body) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
} ,userController.updateSkills);









//<<<<<<<<<<<<----------Delete One User------------->>>>>>>>>>>>>>>>...

router.delete('/:id',(req, res, next) =>{
    const Idvalidate = joi.object({
     id: joi.objectId(), 
    })
    const {error} = Idvalidate.validate(req.params)
     if(error){
         res.status(404).send(error.message)
         return
     }
     next();
 }, userController.deleteUser )

router.route('/')
.delete(userController.deleteAllUser)


// <<<<<<<<<-----------------------------------------------JOBs Api's----------------------------------------------------->>>>>>>>>>>

//<<<<<<<<<<<<------------------get all jobs------------->>>>>>>>>>>>>>>>>>>
router.route('/job/joball')
.get(jobController.getAllJob)


// <<<<<<<<<<<-----------------Get all Job  from Org------------------>>>>>>>>>>>>>>>>>>>>
router.route('/job/org/:id')
.get(jobController.getOrgJob)

//<<<<<<<<<<<<<<<<<<<<<<<<<------------Get One job data--------------->>>>>>>>>>>>>>>>>>>>>>>
router.route('/singlejob/:id')
.get(jobController.getOneJob)



//<<<<<<<<<------------------Appliying Job--------------->>>>>>>>>>>>>>>>>>>>>>>>>>>
router.route('/apply/user_id=:id/job_id=:job_id')
.get(jobController.Applyjob)



// <<<<<<<<<<<<<<<<<<<<<<<<<<<<----------------- Get ORG from Job id------------->>>>>>>>>>>>>>>>>>>>>>>>>


router.route('/aggregate/job_id=:job_id')
.get(jobController.aggregate)



module.exports = router    