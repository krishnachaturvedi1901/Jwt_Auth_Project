const Joi=require('joi')

const AuthRegisterSchema=Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required()
})

module.exports={
    AuthRegisterSchema
}