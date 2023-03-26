const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

const authorize = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next(createHttpError.BadRequest());

  const headersArr = authHeader.split(" ");
  const bearerToken = headersArr[1];
  if (!bearerToken) return next(createHttpError.BadRequest())

  jwt.verify(bearerToken, accessTokenSecret,(err,payload)=>{
     if(err){
        const message=err.name==='JsonWebTokenError'?'Unauthorized':err.message
        return next(createHttpError.Unauthorized(message))
     }
     req.payload=payload
     next()
  });
};

module.exports = {
  authorize
};
