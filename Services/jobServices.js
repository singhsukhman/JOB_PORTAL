const mongoose = require('mongoose')
const {jobSchema} = require('../Model/index')



jobSchema.statics = {
    create : function(data,cb){
        var job = new this(data)
        // console.log('data', data)
        job.save(cb)
    },
    get : function(query,cb){
        this.find(query,cb)
        // .populate('Org' , {"Name": JDTechnoligies})
    }, 
    getById: function(query,cb){
        this.findOne(query,cb)
    },
    updateOne : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$set: updatedata}, {new: true},cb)  
    }, 
    // updateOnfield : function(query, job, cb){
    //     this.findOneAndReplace(query, {$push: job}, {new: true},cb)  
    // }, 
    ApllyJob : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$push: updatedata}, {new: true},cb) 
    },  
    deleteUser : function(query, updatedata, cb){
        this.findOneAndUpdate(query, {$pull: {Applicant: updatedata}}, {new: true},cb)
    }, 
    deleteOne: function(query, cb) { 
        this.findOneAndDelete(query,cb);  
    },
    deleteAllJob: function(query,cb) {
        this.deleteMany(query,cb);  
    }
}

const JobModel = mongoose.model('Job', jobSchema)
module.exports = JobModel