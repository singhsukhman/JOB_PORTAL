const mongoose = require('mongoose')
const {orgSchema} = require('../Model/index')



orgSchema.statics = {
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
    // getByEmail: function(query,cb){ 
    //     this.findOne(query,cb) 
    // },
    updateOne : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set: updatedata}, {new: true},cb)
    },
    deleteOne: function(query, cb) {
        this.findOneAndDelete(query,cb);  
    },
    deleteAllORG: function(query,cb) {
        this.deleteMany(query,cb);   
    }
}

const OrgModel = mongoose.model('Organization', orgSchema)
module.exports = OrgModel