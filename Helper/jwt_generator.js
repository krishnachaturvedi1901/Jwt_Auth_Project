const jwt=require('jsonwebtoken')
const createError=require('http-errors')
const accessTokenSecret =process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret=process.env.REFRESH_TOKEN_SECRET
const client=require('./connect_redis')


module.exports={
    createAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={}
            const secret=accessTokenSecret
            const options={
               expiresIn:'1d',
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
              client.set(userId,token,'EX',365*24*60*60,(err,reply)=>{
                if(err){
                  console.log(err.message)
                  return reject(createError.InternalServerError())
                }
              })
              resolve(token)
            })
        })
    },
    verifyRefreshToken:(refToken)=>{
        return new Promise((resolve,reject)=>{
          
            jwt.verify(refToken,refreshTokenSecret,async(err,payload)=>{
              if(err) return reject(createError.Unauthorized())
               const userId=payload.aud

               const result= await client.GET(userId)
               if(!result){
                 return reject(createError.InternalServerError())
               }
               if(refToken===result) return resolve(userId)

               reject(createError.Unauthorized())
            })
        })
    }

}