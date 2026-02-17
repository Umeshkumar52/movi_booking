import bcrypt from 'bcrypt'

export default async function comparePassword(newPassword,oldPassword){
try{
  return  bcrypt.compare(newPassword,oldPassword)
}catch(err){
   return res.status(3001).json({
    message:"something went wrong"
   })
}
}
