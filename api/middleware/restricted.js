const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../secrets/index')


module.exports = (req, res, next) => {
  next();
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.


    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

      
        const token = req.headers.authorization //On valid token in the Authorization header, call next.
        if(!token) {
          return next(res.json({message:"token required",status:401,})) //2
        }
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
          if(err) {
            return next(res.status(401).json({message:"token invalid"})) //3
          }
          req.decodedToken = decodedToken
          next()
        })

};
