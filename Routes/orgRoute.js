const joi = require('joi')
joi.objectId = require('joi-objectid')(joi)
const {orgController, jobController}  = require('../api/index')
const express = require('express')
const { required } = require('joi')

const router = express.Router()

//<<<<<<<<<<<<<<<<<<<------------------ ORG Sign Up ------------------>>>>>>>>>>>>>>>>>>>>

router.post('/signup' ,(req, res, next) =>{
    // console.log(req.body);
    const orgRoute = joi.object().keys({
        Name : joi.string().regex(/^[a-zA-Z. ]+$/).min(3).max(50).required(),
        Email : joi.string().required().trim(true).email(),
        Password : joi.string().trim(true).required(),
        // ConfirmPassword :  joi.any().valid(joi.ref('Password')).required(),
        Address : joi.string(),
        Phone : joi.number(), 
        Country : joi.string().required(),
    })
    const {error} = orgRoute.validate(req.body)
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, orgController.SignupOrg)
 
// <<<<<<<<<<<--------------------Get All ORG's------------------------>>>>>>>>>>>>>>>>>>>>

router.route('/')
.get(orgController.getOrg)


// <<<<<<<<<<<<<<<<-------------------GEt One ORG---------------------->>>>>>>>>>>>>>>>>>>>>

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
}, orgController.getOneOrg )

/// <<<<<<<<<<<<<<<,-------------------ORG Login--------------------->>>>>>>>>>>>>>>>>>>>>>
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
}, orgController.loginOrg )


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
}, orgController.forgetPass)


 
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
}, orgController.resetPass)

//<<<<<<<<<<<<<<<<<<<<<--------------------Update ORG ------------------>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.patch('/:id' ,(req, res, next) =>{
    // console.log(req.body); 
    const orgRoute = joi.object().keys({
        id: joi.objectId(),
        Name : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/).min(3).max(50),
        UserType : joi.string().alphanum().regex(/^[a-zA-Z. ]+$/),
        Email : joi.string().trim(true).email(),
        Password : joi.string().min(6).trim(true),
        ConfirmPassword : joi.string().min(6).trim(true),
        Address : joi.string(),
        Phone : joi.number(), 
        Country : joi.string(),
    })

    const {error} = orgRoute.validate((req.body  && req.params)) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, orgController.updateOneORG)


//<<<<<<<<<<<-----------------Delete One ORG------------------>>>>>>>>>>>>>>>>>>>>

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
 }, orgController.deleteORG )

router.route('/')
.delete(orgController.deleteAllORG)






// $$$$$$$$$$$$$$$$$$$$---------------------------------Job's Api---------------------------------$$$$$$$$$$$$$$$$$$$$$


// <<<<<<<<<<<<<<<<--------------------------Create Job----------------------------------->>>>>>>>>>>>>>>>


router.post('/createjob/org_id=:id' ,(req, res, next) =>{
    // console.log(req.body);
    const jobRoutes = joi.object().keys({
        JobTitle : joi.string().min(3).required(),
        Description : joi.string().required(),
        RequiredSkills :  joi.array().required(),
        Salary : joi.string().required(),
        Location:  joi.string().required(),
        // Org_job :joi.required() 
    })
    const {error} = jobRoutes.validate(req.body)
    if(error){
        res.status(404).send(error.message)
        return
    }
    next();
}, jobController.createJob)



//  <<<<<<<<<----------------------Update Job------------------------->>>>>>>>>>>>>>>>>>>>

router.patch('/updatejob/:id' ,(req, res, next) =>{
    // console.log(req.body);
    const jobRoute = joi.object().keys({
        id: joi.objectId(),
        JobTitle : joi.string().min(3),
        Description : joi.string(),
        RequiredSkills :  joi.array(),
        Salary : joi.string(),
        Location:  joi.string(),
        Organization:  joi.string(),
        
    })

    const {error} = jobRoute.validate(req.body  || req.params) 
    if(error){
        res.status(404).send(error.message)
        return
    }
    next()
}, jobController.updateOneJob)


// <<<<<<<<<<<<<<<<-----------Delete One Job---------------------->>>>>>>>>>>>>>>>>>>>>>

router.delete('/delJob/:id',(req, res, next) =>{
    const Idvalidate = joi.object({
     id: joi.objectId(), 
    })
    const {error} = Idvalidate.validate(req.params)
     if(error){
         res.status(404).send(error.message)
         return
     }
     next();
 }, jobController.deleteJob )


//  <<<<<<<<<<<<<---------------------Delete All JOb---------------------------->>>>>>>>>>>>>>>>>>>>>>>>>> 
router.route('/delAllJob')
.delete(jobController.deleteManyJob)

//<<<<<<<<<<<<<<<<<<<<<<<-----------Get All Job's With Applicant User's----------------->>>>>>>>>>>>>>>>>.
router.route('/Job/WithUsers')
.get(jobController.getAllJobWithApplyUsers)


//<<<<<<<<<<<<<<<<<<<<<<<-----------Get Job With Applicant User's----------------->>>>>>>>>>>>>>>>>.
router.route('/Job/With/Applicant/:id') 
.get(jobController.getJobWithApplyUsers)




// $$$$$$$$$$$$$$$$$$$$---------------------------------User's Api---------------------------------$$$$$$$$$$$$$$$$$$$$$

// router.route('/Job/delete/Applicant/:id/:job_id')
// .delete(jobController.deleteApplicant)

router.delete('/Job/delete/Applicant/user_id=:id/job_id=:job_id'
,jobController.deleteApplicant)

 

module.exports = router  