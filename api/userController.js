const { userService } = require('../Services/index')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
// const { x } = require('joi')


module.exports = {
    SignupUser: async function (req, res, next) {
        //  if(!req.body.Name ||  !req.body.UserType || !req.body.Email || !req.body.Password || !req.body.ConfirmPassword || !req.body.Address || !req.body.Phone || !req.body.Country){
        //      res.status(404).json({message: "Required field Can't be empty"})
        //  } 
        try {
            var user = await userService.find({ Email: req.body.Email })
            if(user.length>0){
                throw "Email Already Exit"
  
            }
        } catch (error) {
            return res.status(404).send(error)
        }
 
        bcrypt.hash(req.body.Password, 10).then(function (hash) {
            // console.log('req.body.Passwor---------------------------------d', req.body.Password) 

            var user = {
                FirstName: req.body.FirstName,
                LastName: req.body.LastName,
                Email: req.body.Email,
                Password: hash,
                Phone: req.body.Phone,
                Gender: req.body.Gender,
                Country: req.body.Country,
                Skills : req.body.Skills,
                Description: req.body.Description,
                Education: req.body.Education, 
                CurrentCompany: req.body.CurrentCompany,
            }
            // console.log('user--------------------------------------------------------------------', user)
            userService.create(user, function (err, user) {
 
                if (err) {
                    res.status(404).json({
                        message: "User Can't Create",
                        error: err
                    })
                }
                
var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(({
//   service: 'gmail',
  host: 'smtp.gmail.com',
//   port : 587,
  auth: {
    user: 'sukhman.singh@epitometechnologies.com',
    pass: 'Sukhman123@#'
  }
}));

var mailOptions = {
  from: 'sukhman.singh@epitometechnologies.com',
  to: 'sukhman.singh@epitometechnologies.com',
  subject: 'Sending Email using Node.js[nodemailer]',
  text: 'User Create Successfully' + user
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    res.status(201).json({
        message: "User created successfully", user: user
    })
  }
}); 
                // res.status(201).json({
                //     message: "User created successfully", user: user
                // })
            })
        })
    },

    //// User LOgin Controller

    loginUser: async (req, res, next) => {

        const User = await userService.findOne({ Email: req.body.Email })
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

//<<<<<<<<<<<<<-----------------forget User password----------------->>>>>>>>>>>>>>>>>

forgetPass: async (req, res, next) => {

    const User = await userService.findOne({ Email: req.body.Email })
    // console.log('User', User)
    // console.log('User-------------------------------------------------------', User)
    // console.log('Email', req.body.Email)
    if (!User) {
        res.status(404).json({
            message: "InValid Email"
        })
    }

        const payload = {
            Email: User.Email,
            id: User.id 
        }
        const secret = process.env.JWT_SECRET + User.Password
        // console.log('User.Password', User.Password)

        const token = jwt.sign(payload, secret, { expiresIn: '15m' })
        const link = `localhost:8000/api/user/reset_pass/${User.id}/${token}`
        // console.log(link);
    // console.log('Org', Org)
      

    var nodemailer = require('nodemailer');
// var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport(({
//   service: 'gmail',
  host: 'smtp.gmail.com',
//   port : 587,
  auth: {
    user: 'sukhman.singh@epitometechnologies.com',
    pass: 'Sukhman123@#'
  }
}));

var mailOptions = {
  from: 'sukhman.singh@epitometechnologies.com',
  to: 'sukhman.singh@epitometechnologies.com',
  subject: 'Sending Email using Node.js[nodemailer]',
  text: link
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    res.status(201).json({message : "token Sent Successfully", link : link})       

  }
}); 


        // res.status(201).json({message : "token Sent Successfully", link : link})       
},



//<<<<<<<<<<<<-----------------Reset User PassWord------------------>>>>>>>>>>>>
resetPass: async (req, res, next) => {  
  
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        // console.log('req.params.id', req.params.id)
        res.json({ message: "Invalid User ID" })
    } 
    const UserBack = await userService.findOne({ _id: req.params.id })
    // console.log('UserBack-----------------------------------------------------------------------------', UserBack)
   
    const {id , token} = req.params  
    const {Password } = req.body
    
 
    if(id !== (UserBack._id.toString())){ res.status(404).json({message:"Invalid Id"})} 
    // console.log('id-------------------------------------', id)
    // console.log('Org.id-------------------------', (OrgBack._id.toString()))
    const secret = process.env.JWT_SECRET + UserBack.Password  
    
      bcrypt.hash(Password, 10).then(function (hash)  {        
        var user = {
            Password : hash
        }
        // console.log('Passwordjhcvfj-------------------------------------------------', user.Password) 
        // Org.Password = hash   
    // })
    jwt.verify(token , secret)
      userService.updateOne({ _id: UserBack.id }, user, function (err) { 
        // console.log('Orglkdddddddddddddddddddddddddddddddddddddddddd-----------------', user.Password)
    })  
    try {
  
            res.status(201).json({message: "User Password updated Successsully", user : user})
            // console.log('user------------------------------------------', user)
    }
    catch (error) {
        console.log(error);
        res.status(404).json({error , message : "User Password Can't updated"})
    }
})
},


//<<<<<<<<<<<<-------------Get all users------------->>>>>>>>>>>>>>

    getUser: function (req, res, next) {
        // if(!mongoose.Types.users){  
        //     res.status(404).json({message: "Users data is not found"})
        // }
        userService.get({}, (err, users) => {
            // console.log('users', users)
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({ message: "All Users data", users: users })
        })
    },

    getOneUser: (req, res, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // console.log('req.params.id', req.params.id)
            res.json({ message: "Invalid User ID" })
        }
        userService.getById({ _id: req.params.id }, function (err, User) {

            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(201).json({ message: "Single User data", User: User })
        })
    },
    
    // <<<<<<<<----------Update One User ---------------->>>>>>>>>>>>>

    updateOneUser: async  (req, res, next)=> {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            // console.log('req.params.id', req.params.id)
            res.json({ message: "Invalid User ID" })
        }

        // if(req.body.Education[0] = req.body.Education[1]){
        //     console.log('req.body.Education[1]', req.body.Education[Tenth])
        //     console.log('req.body.Education[0]', req.body.Education[{Tenth}])
        //     res.send("You cant not put same value twice")
        // }
        let user = {}
        if (req.body.FirstName) {
            user.FirstName = req.body.FirstName
        } 
        if (req.body.LastName) { 
            user.LastName = req.body.LastName
        }
        if (req.body.Email) {
            user.Email = req.body.Email
        }
        if (req.body.Password) {
            user.Password = req.body.Password
        }
        if (req.body.Phone) {
            user.Phone = req.body.Phone
        }
        if (req.body.Gender) {
            user.Gender = req.body.Gender
        }
        if (req.body.Country) {
            user.Country = req.body.Country
        }
        if (req.body.Description) {
            user.Description = req.body.Description
        }
      
        if (req.body.CurrentCompany) {
            user.CurrentCompany = req.body.CurrentCompany
        }
      

        if (req.body.Skills) {
            var data = {}
            const userdata = await userService.findOne({ _id: req.params.id })
            if (req.body.Skills.Professional_Skills) {
                data.Professional_Skills = req.body.Skills.Professional_Skills
            }
            if (req.body.Skills.Training_Intership) {
                data.Training_Intership = req.body.Skills.Training_Intership
            }
            if (!req.body.Skills.Professional_Skills && userdata.Skills.Professional_Skills) {
                data.Professional_Skills = userdata.Skills.Professional_Skills
            }
            if (!req.body.Skills.Training_Intership && userdata.Skills.Training_Intership) {
                data.Training_Intership = userdata.Skills.Training_Intership
            }
            user.Skills = data
        }

        // <<<<<<<<<<<<<<<<<------------update Skills of user---------->>>>>>>>>... 
      /*  if(req.body.Skills){
        let Skill =  req.body.Skills
        // console.log('req.body.Skills', req.body.Skills)
        if(Skill.Professional_Skills && Skill.Training_Intership){
           await userService.findByIdAndUpdate({ _id: req.params.id },
                { $set: {
                    "Skills": Skill } }).then(() => {
           return  res.status(201).json({ message: "user Skills update successfull " , Skill })
                }).catch((error)=>{
                        console.log(error);
                })
        }else if(Skill.Professional_Skills){
            console.log('Skills.Professional_Skills',Skill.Professional_Skills) 
 
            await userService.findByIdAndUpdate({_id :req.params.id}, 
            { $set : {
                "Skills.Professional_Skills" : Skill.Professional_Skills }
             }).then(() => {
                        return   res.status(201).json({ message: "user  Professional Skill  update successfully"  , "Professional_Skills" : Skill.Professional_Skills})
                }).catch((error)=>{
                       return res.status(404).send(error)
                })

        } else { 
            await userService.findOneAndUpdate({ _id: req.params.id },
                { $set: {
                    "skills.Training_Intership": Skill.Training_Intership } }).then(() => {
                           return  res.status(200).json({ message: "user Training_Intership Skill update successfully", "Training_Intership" : Skill.Training_Intership })
                }).catch((error)=>{
                    console.log(error);
                })
        }  
            return
    } */

        if (req.body.Education)    {
           
        //   console.log("data ===================-------------------------------------------0",data);
          const userdata = await userService.findOne({ _id: req.params.id })
        //   console.log('userdata-----------------------------', userdata.Education)
          let arr = req.body.Education;
          //console.log(userdata.education);

          let edu = userdata.Education
        
        //   console.log("user Education----------------------------------------------------", user.Education)

        for(let i =0; i<arr.length; i++)
            {
                 if(arr[i].Tenth)
                 {
                      console.log(arr[i])
                      edu[0] = arr[i];
                 }
                 if(arr[i].Twelve)
                 {
                      console.log(arr[i])
                      edu[1] = arr[i];
                 }
                 if(arr[i].Graduation)
                 {
                      console.log(arr[i])
                      edu[2] = arr[i];
                 }
                 if(arr[i].Post_Graduation)
                 {
                      console.log(arr[i])
                      edu[3] = arr[i];
                 }
            }
            user.Education = edu
        }
        // console.log("user-----------------------------------------------------------------[",user);
         await userService.updateOne({ _id: req.params.id }, user,  function (err) {
            // console.log(req.params.id);
            // console.log(user);
            if (err) {
                res.status(404).json({ error: err })
            }
            res.status(201).json({
                message: "User updated sucessfully", user: user,
            })
        })
    },


    // <<<<<<<<<<<<<<<<<<-------------Update User Skills------>>>>>>>>>>>>>>>>>>>>>>>>>
    updateSkills : async function (req, res, next){
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.json({ message: "Invalid User ID" })
        }
        
        if(req.body.Skills){
            let Skill =  req.body.Skills
            // console.log('req.body.Skills', req.body.Skills)
            if(Skill.Professional_Skills && Skill.Training_Intership){
               await userService.findByIdAndUpdate({ _id: req.params.id },
                    { $set: {
                        "Skills": Skill } }).then(() => {
               return  res.status(201).json({ message: "user Skills update successfull " , Skill })
                    }).catch((error)=>{
                            console.log(error);
                    })
            }else if(Skill.Professional_Skills){
                // console.log('Skills.Professional_Skills',Skill.Professional_Skills) 
     
                await userService.findByIdAndUpdate({_id :req.params.id}, 
                { $set : {
                    "Skills.Professional_Skills" : Skill.Professional_Skills }
                 }).then(() => {
                            return   res.status(201).json({ message: "user  Professional Skill  update successfully"  , "Professional_Skills" : Skill.Professional_Skills})
                    }).catch((error)=>{
                           return res.status(404).send(error)
                    })
    
            } else { 
                await userService.findOneAndUpdate({ _id: req.params.id },
                    { $set: {
                        "Skills.Training_Intership": Skill.Training_Intership } }).then(() => {
                               return  res.status(200).json({ message: "user Training_Intership Skill update successfully", "Training_Intership" : Skill.Training_Intership })
                    }).catch((error)=>{
                        console.log(error);
                    })
            }  
       return      
    }
},


    // <<<<<<<<<<<<<<<<<<<<<<<<<<<<< Update User  Education >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    updateEdu : async function (req, res, next){
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.json({ message: "Invalid User ID" })
        }
        if (!mongoose.Types.ObjectId.isValid(req.params.id2)) {
            return   res.json({ message: "Invalid Edu ID" })
        }
        
         if(req.body.Education){
            //  console.log('req.body.Education', req.body.Education)
            let edu = req.body.Education[0]
              
    
// console.log("lkejgbiuervbidsu");

       await userService.findOneAndUpdate({ _id: req.params.id ,  "Education._id" : req.params.id2},
            {$set: { "Education.$" : edu } } ).then(()=>{
                res.status(201).json({message:"User Education update successfully", edu})
            }).catch((error)=>{ res.status(404).send("Something went wrong", error)})
           
        //    console.log('req.params.id', req.params.id)
        //    console.log('req.params.id2', req.params.id2)
        // console.log('-----------------------------------------------',data);

      
    }
},

// <<<<<<<<<<<<<<--------Delete One User --------------->>>>>>>>>>>>>>>>>>>
    deleteUser: function (req, res, next) {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            res.json({ message: "Invalid User ID" })
        }
        userService.deleteOne({ _id: req.params.id }, function (err, user) {
            // console.log(req.params.id);
            // console.log(user);  
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.status(201).json({
                message: "User deleted sucessfully", user: user
            })
        })
    },


// <<<<<<<<<<<<<<--------Delete All Users --------------->>>>>>>>>>>>>>>..

    deleteAllUser: function (req, res, next) {
        userService.deleteMany({}, function (err, users) {
            // console.log(req.params.id);
            console.log(users);  
            if (err) {
                res.status(404).json({
                    error: err
                })
            }
            res.json({
                message: " All users deleted sucessfully", users: users
            })
        })
    },
} 