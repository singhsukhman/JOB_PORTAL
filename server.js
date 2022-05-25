const express = require('express')
const dotenv = require('dotenv').config()
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require('./swagger.json')
const app = express()
const port = process.env.PORT 
const {orgRoute , userRoute } = require('./Routes/index')

// dbconfig 
const {dbconfig} = require('./config/index')

// routes
app.get('/', (req,res)=>{
    res.json({message: "Hello from home page"})
})

// middleware 
app.use(express.json());

app.use('/api', orgRoute, userRoute )


app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, ()=>{
    console.log(`listoning the PORT ${port}`);
})