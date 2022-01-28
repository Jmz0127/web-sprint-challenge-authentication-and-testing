const User = require('../users/users_model')
const checkUserExists = async (req,res,next) => {
 
        let {username} = req.body
        const [existing] = await User.findBy({username:username})
        if(!existing){
            next()
        }
        else{
            next({status:401, message:'username taken'})
        }
   
}

const checkUsername = async (req,res,next) => {
     
    let {username} = req.body
    const [existing] = await User.findBy({username:username})
    if(!existing){
        next({status:401,message:'invalid credentials'})
    }
    else{
        req.user = existing
        next()
    }
}

module.exports = {checkUserExists, checkUsername}