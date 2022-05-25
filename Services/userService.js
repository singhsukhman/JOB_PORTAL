const mongoose = require('mongoose')
const {userSchema} = require('../Model/index')



userSchema.statics = {
    create : function(data,cb){
        var user = new this(data)
        // console.log('data', data)
        user.save(cb)
    },
    get : function(query,cb){
        this.find(query,cb)
    },
    getById: function(query,cb){
        this.findOne(query,cb)
    }, 
    updateEdu : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set :updatedata}, {new: true},cb)
    },
    updateOne : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set :updatedata}, {new: true},cb)
    },
    deleteOne: function(query, cb) { 
        this.findOneAndDelete(query,cb);  
    }, 
    deleteAllUser: function(query,cb) {
        this.deleteMany(query,cb);  
    } 
}

const UserModel = mongoose.model('User', userSchema)
module.exports = UserModel


