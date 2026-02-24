import jwt from 'jsonwebtoken'
function generateToken(payload){
  // const payload= { _id,  role,subscription:subscription,FullName }

 const refreshToken = jwt.sign(
     payload,
      process.env.JWT_SECRET,
      { expiresIn: "15d" },
    );

    const accessToken=jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    return{refreshToken,accessToken}

}
export default generateToken