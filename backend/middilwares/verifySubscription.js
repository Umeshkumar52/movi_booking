 import jwt from 'jsonwebtoken'
 async function verifySubscription(req,res,next){

     const {accessToken}=req.cookies
    if(!accessToken){
        return res.status(401).json({message:"user Not Authenticate !"})}
try {
     const decode= jwt.verify(accessToken,process.env.JWT_SECRET)
   if(
    decode.subscription!=="expire"
   ){
       return res.status(400).json({message:" your subscription has been expired"})
   }
    next()
} catch (error) {
    return res.status(401).json({message:"user Not Authenticate !"})
}
}
export default verifySubscription