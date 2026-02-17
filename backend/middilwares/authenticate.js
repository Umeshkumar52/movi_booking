 import jwt from 'jsonwebtoken'
 async function authenticate(req,res,next){

     const {accessToken}=req.cookies
    if(!accessToken){
        return res.status(401).json({message:"user Not Authenticate !"})}
try {
     const decode= jwt.verify(accessToken,process.env.JWT_SECRET)
    req.user=decode
    next()
} catch (error) {
    return res.status(401).json({message:"user Not Authenticate !"})
}
}
export default authenticate