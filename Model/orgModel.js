const mongoose = require('mongoose')
const Schema = mongoose.Schema

const orgSchema = new Schema({
    Name:{
        type:String,
        minlength:3,
        required: true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    }, 
    Password:{
        type: String,
        required:true,
    },
    // ConfirmPassword:{
    //     type: String,
    // },
    Address: {
        type: String,
    },
    Phone: {
        type:Number,
    },
    Country:{
        type:String,
        required:true, 
    },
    // Jobs: [{ type : Schema.Types.ObjectId , ref: 'Job'}]
})

module.exports = orgSchema

