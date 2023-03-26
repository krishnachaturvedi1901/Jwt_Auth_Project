const UserModel = require("../Models/User.model.js");
const createError = require("http-errors");
const { AuthRegisterSchema } = require("../Helper/validation_schema.js");
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require("../Helper/jwt_generator.js");

async function register(req, res, next) {
  try {
    const result = await AuthRegisterSchema.validateAsync(req.body);

    const alreadyExist = await UserModel.findOne({ email: result.email });
    if (alreadyExist)
      throw createError.Conflict(`${result.email} already registered`);

    const user = new UserModel(result);
    const savedUser = await user.save();
    const id=savedUser._id.toString()

    const accessToken=await createAccessToken(id)
    const refreshToken=await createRefreshToken(id)

    res.status(200).send({accessToken,refreshToken})
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
}

async function login(req,res,next){
  try {
    const result = await AuthRegisterSchema.validateAsync(req.body)

    const user=await UserModel.findOne({email:result.email})
    if(!user) throw createError.NotFound('User email not registered')
    
    const isPassMatch=await user.verifyPassword(result.password)
    if(!isPassMatch) throw createError.Unauthorized('Email/Password invalid')

    const accessToken=await createAccessToken(user.id)
    const refreshToken=await createRefreshToken(user.id)

    res.status(200).send({accessToken,refreshToken})
    
  } catch (error) {
    if(error.isJoi===true){
      return next(createError.BadRequest('Email/Password invalid'))
    }
    next(error)
  }
}

async function refreshToken(req,res,next){
  try {
    const {refreshToken}=req.body
    if(!refreshToken) throw createError.BadRequest()

    const userId=await verifyRefreshToken(refreshToken)
    
    const newAccessToken=await createAccessToken(userId)
    const newRefreshToken=await createRefreshToken(userId)

    res.status(200).send({accessToken:newAccessToken,refreshToken:newRefreshToken})
    
  } catch (error) {
    next(error)
  }
}


module.exports = {
  register,
  login,
  refreshToken
};
