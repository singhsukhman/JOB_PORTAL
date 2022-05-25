const { array } = require('joi')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true,
    },
    //  ConfirmPassword: {
    //         type: String,
    //     },
    Phone: {
            type: Number,
            required: true,
            minlength: 9
        },
    
    Gender: {
        type: String,
        enum: ['M', 'F', 'O']
    },
    Country: {
        type: String,
        required: true,
    },
    Description: {
        type: String
    },
    Skills :{  
        Professional_Skills:{type: Array, required: true},
        Training_Intership:{type: Array , required: true},
    }, 
    Education: [{ 
        Tenth: { type: String},
        Twelve: { type: String},
        Graduation :{ type: String },
        Post_Graduation: { type: String }
    
 }],
    CurrentCompany: {
        type: String,
        required: true
    }
})

module.exports = userSchema

