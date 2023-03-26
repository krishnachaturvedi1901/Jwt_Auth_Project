const mongoose=require('mongoose')
const mongodb_uri=process.env.MONGODB_URI

mongoose.connect(mongodb_uri)
.then(()=>{
    console.log('Finally connected to db')
})
.catch((err)=>{
    console.log("Error inconnect->",err.message)
})

mongoose.connection.on('connected',()=>{
    console.log('Mongoose connected to mongoDb')
})
mongoose.connection.on('error',(err)=>{
    console.log("Error mongoose->",err.message)
})
mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose connection is failed')
})
process.on('SIGINT',async()=>{
   await mongoose.connection.close()
   process.exit(0)
})