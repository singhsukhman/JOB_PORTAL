const {JobModel} = require('../Services/index')
const mongoose = require('mongoose')
const { aggregate } = require('../Services/orgServices')
const { jobSchema } = require('../Model')


module.exports = {
        createJob :  function (req, res, next) {
             if(!req.body.JobTitle ||  !req.body.Description || !req.body.RequiredSkills || !req.body.Salary || !req.body.Location){
                 res.status(404).json({message: "Required field Can't be empty"})
             } 
             else{  
                 var job = {      
                    JobTitle: req.body.JobTitle,     
                    Description: req.body.Description,      
                    RequiredSkills:  req.body.RequiredSkills,  
                    Salary: req.body.Salary, 
                    Location : req.body.Location,
                    Org_id  : req.params.id  
                 }     
             }   
        //  console.log("jhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh", job );
           JobModel.create(job, function(err, job ) {  
     
             if(err) { 
                 res.status(404).json({ message : "Job Can't Create",
                     error : err
                 })
             }
             res.status(201).json({ 
                 message : "Job created successfully" , job: job
             })  
         })
     } ,


     //**************************************Get All JOb's*****************************//
     getAllJob: function (req, res, next) {
        JobModel.get({}, (err, Jobs) => {
            // console.log('Organization', Organization)
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({ message: "All JOB detail", Jobs: Jobs })
        })
    },

    // *****************Get One Job*****************//

    getOneJob : (req,res,next)=>{ 
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ 
            // console.log('req.params.id', req.params.id)
            res.json({message: "Invalid Job ID"}) 
        }  
        JobModel.getById({_id: req.params.id}, function(err, job){ 
    
            if(err){
                res.status(404).json({  
                    error:err
                })     
            }
            res.status(201).json({ message: "Single Job data", job : job })   
        }) 
    },


     //***************Get All Job's From One Organization***************************//
     getOrgJob : function  (req, res, next){
        JobModel.get({Org_id : req.params.id}, (err, job)=>{
            // console.log('users', users)
            if(err){  
                res.status(404).json({error:err}) 
            }
            res.status(201).json({message: "All Jobs Of  One ORG", job: job}) 
        }) 
    },
    
    //******************Update One job********************//
    updateOneJob : function(req,res, next){ 
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ 
            // console.log('req.params.id', req.params.id)
            res.json({message: "Invalid job ID"}) 
        }
        let job ={}  
        if(req.body.JobTitle){ 
            job.JobTitle = req.body.JobTitle
        }
        if(req.body.Description){  
            job.Description = req.body.Description
        }
        if(req.body.RequiredSkills){
            job.RequiredSkills = req.body.RequiredSkills
        }
        if(req.body.Salary){
            job.Salary = req.body.Salary
        }
        if(req.body.Location){
            job.Location = req.body.Location
        }

        // console.log("jo--------------------------------------------------------------------------------------b",job);
        JobModel.updateOne({ _id : req.params.id}, job, function(err){
            // console.log(req.params.id);
            // console.log(job);
            if(err){
                res.status(404).json({error:err})  
            }
            res.status(201).json({
                message: "job updated sucessfully", job: job
            }) 
        })
    },
    
    //******************************User Apply One job**************************************//

    Applyjob : async function(req,res, next){ 
        if(!mongoose.Types.ObjectId.isValid(req.params.job_id)){ 
            // console.log('req.params.id', req.params.id)
            res.json({message: "job ID Invalid"}) 
        } 
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ 
            // console.log('req.params.id', req.params.id)
            res.json({message: "Invalid User ID"}) 
        }  
       
       
        const jobdetail = await JobModel.findOne({ _id: req.params.job_id })
        let arr = jobdetail.Applicant
        // console.log('arr------------------------------------------------', arr)
          if(arr.indexOf(req.params.id)>=0){
            return res.status(404).json({ message: "You Already Applied  for this Job"})
        }
        
        let User ={ 
          Applicant: req.params.id 
            
        }
        // console.log('User_id--------------------------------------------------------------------------------', User)
         await JobModel.ApllyJob({ _id : req.params.job_id}, User, function(err){
            //  console.log('req.params.job_id--------------------------------========--', req.params.job_id)
            // console.log(req.params.id);
            // console.log(job);
            if(err){
                res.status(404).json({error:err})
            }
            res.status(201).json({
                message: "Job Apply Sucessfully", job: User
            }) 
        }) 
    },

// <<<<<<<<<<<<------------------------ Delete User from Applicant------------------------>>>>>>>>>>>>>>>


deleteApplicant: async function(req, res, next){ 

    if(!mongoose.Types.ObjectId.isValid(req.params.job_id)){ 
        
        res.json({message: "Invalid Job ID"}) 
    } 
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){ 
        res.json({message: "Invalid User ID"}) 
    }
    const user = req.params.id
         JobModel.deleteUser({_id : req.params.job_id}, user, function(err, user){
        // console.log("-------------------------------------------------------------------------------------------------",req.params.id);
        if(err){
            res.status(404).json({
                error:err
            })
        }
        res.status(201).json({
            message: "User from Applicant Delete sucessfully", user:user 
        })
    }) 

},

    //******************Get All JOB's with All Applicant************************

    getAllJobWithApplyUsers: async function (req, res, next) {
        await JobModel.find({ }).populate("Applicant", 'FirstName  Email')
            // console.log('Organization', Organization)
            .then(user =>{
            res.status(201).json({ message: "All JOB with Applicant User's", user: user })
        })
},
    

//****************** Get JOB with All Applicant************************//-----------------------???????

    getJobWithApplyUsers: async function (req, res, next) {
        // console.log('req.params.id--------------------------------------------------===============---', req.params.id)
        await JobModel.findOne({_id: req.params.id }).populate("Applicant", 'FirstName  Email')
            // console.log('Organization', Organization)
            .then(user =>{
            res.status(201).json({ message: "JOB with Applicant User's", user: user })
        })
},
 
    // ****** Delete One job*********************//

    deleteJob: function(req, res, next){ 
        if(!mongoose.Types.ObjectId.isValid(req.params.id)){ 
            res.json({message: "Invalid job ID"}) 
        } 
        JobModel.deleteOne({_id : req.params.id}, function(err, job){
            // console.log(req.params.id);
            // console.log(job);  
            if(err){
                res.status(404).json({
                    error:err
                })
            }
            res.status(201).json({
                message: "Job Delete sucessfully", job:job 
            })
        })
    },

    // ************ Delete All Job's******************//
    deleteManyJob: function(req, res, next){
        JobModel.deleteMany({}, function(err, job){
            // console.log(req.params.id);
            // console.log(job);
            if(err){
                res.status(404).json({
                    error:err
                })
            }
            res.json({
                message: " All job deleted sucessfully", job:job
            })
        })
    }  ,  
     




// <<<<<<<<<<<<<<<<<<<<<<<<<<<<----------------- Get ORG from Job id------------->>>>>>>>>>>>>>>>>>>>>>>>>


aggregate :  async function (req, res, next){

    var mongodb = require("mongodb");
    var ObjectID = mongodb.ObjectID;


    if(!mongoose.Types.ObjectId.isValid(req.params.job_id)){ 
        
        res.json({message: "Invalid Job ID"}) }

    var pipeline = [
        {
            "$match": {
                "_id": new ObjectID(req.params.job_id)
            }
        }, 
        { 
            "$lookup": {
                "from": "organizations",
                "let": { 
                    "orgnationId": "$Org_id"
                },
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$and": [
                                    {
                                        "$eq": [
                                            "$_id", 
                                            "$$orgnationId"
                                        ]
                                    }
                                ] 
                            }
                        }
                    },
                    {
                        "$project": {
                            "Name": 1.0,
                            "Email": 1.0,
                            "Address": 1.0,
                            "_id": 1.0
                        }
                    }
                ],
                "as": "<Organization Detail>"
            }
        }
    ];

    var options = {
        allowDiskUse: false
    };
    
    try {
        var cursor = await JobModel.aggregate(pipeline, options);
        res.status(201).send(cursor)
        
    } catch (error) {
        res.status(404).send(error + 'Something Went Wrong')
    }
}


}  