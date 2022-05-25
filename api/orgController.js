const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const { orgService } = require('../Services/index')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
    SignupOrg: async function (req, res, next) {
        //  if(!req.body.Name ||  !req.body.UserType || !req.body.Email || !req.body.Password || !req.body.ConfirmPassword || !req.body.Address || !req.body.Phone || !req.body.Country){
        //      res.status(404).json({message: "Required field Can't be empty"})
        //  } 


        const user = await orgService.find({ Email: req.body.Email })
        //    console.log('user----------------------', user)
    
           if(user.length>0){
               res.json({message :"Email Allready Exit"})
               return
           }
 

        bcrypt.hash(req.body.Password, 10).then(function (hash) {

            // console.log('req.body.Password', req.body.Password)

            var org = {
                Name: req.body.Name,
                //  UserType: req.body.UserTy  pe,        
                Email: req.body.Email,
                Password: hash,
                Address: req.body.Address,
                Phone: req.body.Phone,
                Country: req.body.Country
            };

            orgService.create(org, function (err, org) {

                if (err) {
                    res.status(404).json({
                        message: "Organization Can't Create",
                        error: err
                    })
                }
                res.status(201).json({
                    message: "Organization created successfully", org: org
                })
            })
        }) 
    },


    ////   LOgin Controller

    loginOrg: async (req, res, next) => {

        const User = await orgService.findOne({ Email: req.body.Email })
        // console.log('User-------------------------------------------------------', User)
        // console.log('Email', req.body.Email)
        if (!User) {
            res.status(404).json({
                message: "InValid Email"
            }) 
        }
        else {
            let validPass = await bcrypt.compare(req.body.Password, User.Password)
            if (validPass) {
                res.status(201).json({ message: "Login Succesfull", User: User })
            }
            if (!validPass) {
                res.status(404).json({
                    message: "InValid Password"
                })
            }

        }
    },




    //<<<<<<<<<<<<<-----------------forget ORG password----------------->>>>>>>>>>>>>>>>>

    forgetPass: async (req, res, next) => {

        const Org = await orgService.findOne({ Email: req.body.Email })
        // console.log('Org', Org)
        // console.log('User-------------------------------------------------------', User)
        // console.log('Email', req.body.Email)
        if (!Org) {
            res.status(404).json({
                message: "InValid Email"
            })
        }

            const payload = {
                Email: Org.Email,
                id: Org.id 
            }
            const secret = process.env.JWT_SECRET + Org.Password

            const token = jwt.sign(payload, secret, { expiresIn: '15m' })
            const link = `localhost:8000/api/org/reset_pass/${Org.id}/${token}`
            // console.log(link);
        // console.log('Org', Org)

            res.status(201).json({message : "token Sent Successfully", link : link})       
    },


 
    //<<<<<<<<<<<<-----------------Reset ORG PassWord------------------>>>>>>>>>>>>
    resetPass: async (req, res, next) => {  
      
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // console.log('req.params.id', req.params.id)
            res.json({ message: "Invalid Organizations ID" })
        } 
        const OrgBack = await orgService.findOne({ _id: req.params.id })
        // console.log('OrgBack-----------------------------------------------------------------------------', OrgBack)
       
        const {id , token} = req.params 
        const {Password } = req.body
        

        if(id !== (OrgBack._id.toString())){ res.status(404).json({message:"Invalid Id"})} 
        // console.log('id-------------------------------------', id)
        // console.log('Org.id-------------------------', (OrgBack._id.toString()))
        const secret = process.env.JWT_SECRET + OrgBack.Password  
        
          bcrypt.hash(Password, 10).then(function (hash)  {        
            var Org = {
                Password : hash
            }
            // console.log('Passwordjhcvfj-------------------------------------------------', Org.Password)
            // Org.Password = hash   
        jwt.verify(token , secret)
          orgService.updateOne({ _id: OrgBack.id }, Org, function (err) { 
            // console.log('Orglkdddddddddddddddddddddddddddddddddddddddddd-----------------', Org.Password)
        })  
        try {       
                res.status(201).json({message: "Org Password updated Successsully", Org : Org})
                // console.log('Org--------dj---------------------------------', Org.Password)
        }
        catch (error) {
            console.log(error);
            res.status(404).json({error , message : "Org Password Can't updated"})
        }
    }) 
},
    
 
 
    //<<<<<<<<<<<<<------------Get all Org----------->>>>>>>>>>>>. 
    getOrg: function (req, res, next) { 
        orgService.get({}, (err, Organizations) => {
            // console.log('Organization', Organization)
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({ message: "All Organizations detail", Organizations: Organizations })
        })
    },

    //<<<<<<<--------Get One Org --------->>>>>>>>>>>>>>>>>

    getOneOrg: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // console.log('req.params.id', req.params.id)
            res.json({ message: "Invalid Organizations ID" })
        }
        orgService.getById({ _id: req.params.id }, function (err, Organization) {

            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(201).json({ message: "Single Organization data", Organization: Organization })
        })
    },

    //<<<<<<<<<<<<<<--------------Update One ORG-------------->>>>>>>>>>>>>>>>>>>>
    updateOneORG: function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // console.log('req.params.id', req.params.id)
            res.json({ message: "Invalid Organizations ID" })
        }
        let Organization = {}
        if (req.body.Name) {
            Organization.Name = req.body.Name
        }
        if (req.body.UserType) {
            Organization.UserType = req.body.UserType
        }
        if (req.body.Email) {
            Organization.Email = req.body.Email
        }
        if (req.body.Password) {
            Organization.Password = req.body.Password
        }
        if (req.body.ConfirmPassword) {
            Organization.ConfirmPassword = req.body.ConfirmPassword
        }
        if (req.body.Address) {
            Organization.Address = req.body.Address
        }
        if (req.body.Phone) {
            Organization.Phone = req.body.Phone
        }
        if (req.body.Country) {
            Organization.Country = req.body.Country
        }

        // console.log(Organization);
        orgService.updateOne({ _id: req.params.id }, Organization, function (err) {
            // console.log(req.params.id);
            // console.log(Organization);
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({
                message: "Organization updated sucessfully", Organization: Organization
            })
        })
    },

    //<<<<<<<<<------------Delete One ORG---------->>>>>>>>>>>>>>>>

    deleteORG: function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({ message: "Invalid Organization ID" })
        }
        orgService.deleteOne({ _id: req.params.id }, function (err, Organization) {
            // console.log(req.params.id);
            // console.log(Organization);  
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(201).json({
                message: "Organization deleted sucessfully", Organization: Organization
            })
        })
    },
    //<<<<<<<<<<<<---------------Delete ALl ORG--------------->>>>>>>>>>>>>>>>```
    deleteAllORG: function (req, res, next) {
        orgService.deleteMany({}, function (err, Organization) {
            // console.log(req.params.id);
            // console.log(Organization);
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.json({
                message: " All Organization deleted sucessfully", Organization: Organization
            })
        })
    },
}