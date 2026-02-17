import jwt from 'jsonwebtoken'
function generateToken({_id,role}){
 const refreshToken = jwt.sign(
      { _id:_id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "15d" },
    );

    const accessToken=jwt.sign(
      { _id:_id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "30m" },
    );

    return{refreshToken,accessToken}

}
export default generateToken