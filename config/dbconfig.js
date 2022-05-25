const mongoose = require('mongoose')
const dotenv = require('dotenv')
module.exports ={
    dbconfig : mongoose.connect(process.env.DB_HOST).then(()=>{
        console.log('DB connection DONE');
    }).catch((err)=>{
        console.log(err+'No DB connection');
    })
}