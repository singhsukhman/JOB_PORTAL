const mongoose = require('mongoose')
const Schema = mongoose.Schema

const jobSchema = new Schema({
    JobTitle : {
        type:String,
        required: true
    },
    Org_id : {
        type : Schema.Types.ObjectId ,
        ref : 'Organization'
    },
    Applicant: [{
        type : String ,
        ref : 'User'
}],  
    Description :{
        type:String,
        required: true
    },
    RequiredSkills :[String],
    Salary :{
        type: String,
        required:true,
    },
    Location : {
        type: String, 
        required: true
    }
})

module.exports = jobSchema

