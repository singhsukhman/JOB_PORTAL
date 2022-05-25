// const joi = require('joi')
// const {jobController}  = require('../api/index')
// const express = require('express');
// const router = express.Router()
// //
// // router.post('/' ,(req, res, next) =>{
// //     // console.log(req.body);
// //     const jobRoutes = joi.object().keys({
// //         JobTitle : joi.string().min(3).required(),
// //         Description : joi.string().required(),
// //         Skills :  joi.array().optional().items(joi.object().keys({
// //         "Professional-Skills": joi.string().required(),
// //         "Training/Intership": joi.string().required(),
// //          })),
// //         Salary : joi.string().required(),
// //         Location:  joi.string().required(),
// //         // Org_job :joi.required()
// //     })
// //     const {error} = jobRoutes.validate(req.body)
// //     if(error){
// //         res.status(404).send(error.message)
// //         return
// //     }
// //     next();
// // }, jobController.createJob)

// // //
// // router.route('/')
// // .get(jobController.getAllJob)

// /////////
// // router.route('/:id')
// // .get(jobController.getOrgJob)

// // //
// // router.get('/:id',(req, res, next) =>{
// //    const Idvalidate = joi.object({
// //     id: joi.objectId(), 
// //    })
// //    const {error} = Idvalidate.validate(req.params)
// //     if(error){
// //         res.status(404).send(error.message)
// //         return
// //     }
// //     next();
// // }, jobController.getOneJob )



// // ////////
// // router.patch('/:id' ,(req, res, next) =>{
// //     // console.log(req.body);
// //     const jobRoute = joi.object().keys({
// //         id: joi.objectId(),
// //         JobTitle : joi.string().min(3),
// //         Description : joi.string(),
// //         Skills :  joi.array().optional().items(joi.object().keys({
// //         "Professional-Skills": joi.string(),
// //         "Training/Intership": joi.string(),
// //          })),
// //         Salary : joi.string(),
// //         Location:  joi.string(),
// //         Organization:  joi.string(),
        
// //     })

// //     const {error} = jobRoute.validate(req.body  || req.params) 
// //     if(error){
// //         res.status(404).send(error.message)
// //         return
// //     }
// //     next();
// // }, jobController.updateOneJob)


// ////////
// // router.delete('/:id',(req, res, next) =>{
// //     const Idvalidate = joi.object({
// //      id: joi.objectId(), 
// //     })
// //     const {error} = Idvalidate.validate(req.params)
// //      if(error){
// //          res.status(404).send(error.message)
// //          return
// //      }
// //      next();
// //  }, jobController.deleteJob )

//  ///////
// // router.route('/')
// // .delete(jobController.deleteManyJob)




// module.exports = router