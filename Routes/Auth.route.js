const express=require('express')
const { register, login, refreshToken } = require('../Controllers/Auth.controller')
const AuthRoute=express.Router()

AuthRoute.post('/register',register)

AuthRoute.post('/login',login)

AuthRoute.post('/refresh-token',refreshToken)

AuthRoute.delete('/logout',async(req,res)=>{
    res.send('logout')
})



module.exports=AuthRoute