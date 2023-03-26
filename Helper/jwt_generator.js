const jwt=require('jsonwebtoken')
const createError=require('http-errors')
const accessTokenSecret =process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret=process.env.REFRESH_TOKEN_SECRET
module.exports={
    createAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={}
            const secret=accessTokenSecret
            const options={
               expiresIn:'20s',
               issuer:'Jwt-Auth-Project',
               audience:userId
            }
            jwt.sign(payload,secret,options,(err,token)=>{
              if(err){
                console.log(err.message)
                return reject(createError.InternalServerError())
              }
              resolve(token)
            })
        })
    },
    createRefreshToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={}
            const secret=refreshTokenSecret
            const options={
               expiresIn:'1y',
               issuer:'Jwt-Auth-Project',
               audience:userId
            }
            jwt.sign(payload,secret,options,(err,token)=>{
              if(err){
                console.log(err.message)
                return reject(createError.InternalServerError())
              }
              resolve(token)
            })
        })
    },
    verifyRefreshToken:(refToken)=>{
        return new Promise((resolve,reject)=>{
            jwt.verify(refToken,refreshTokenSecret,(err,payload)=>{
              if(err) return reject(createError.Unauthorized())
               resolve(payload.aud)
            })
        })
    }

}