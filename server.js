const express=require('express')
const morgan=require('morgan')
const createError=require('http-errors')
require('dotenv').config()
const PORT=process.env.PORT||5000
require('./Helper/connect_mongodb.js')
const AuthRoute=require('./Routes/Auth.route.js')
const { authorize } = require('./Middlewares/auth.middleware.js')

const app=express()
app.use(express.json())
app.use(morgan('dev'))

app.get('/', authorize, async(req,res)=>{
    res.send('Home route')
})

app.use('/auth',AuthRoute)

app.use(async(req,res,next)=>{
//   const error=new Error('Invalid endpoint')
//   error.status=404
//   next(error)
  next(createError.NotFound('Invalid endpoint'))
})
app.use((err,req,res,next)=>{
  res.status(err.status).send({
    error:{
      status:err.status||500,
      message:err.message
    }
  })
})

app.listen(PORT,()=>{
  console.log(`Server is listening to port ${PORT}`)
})