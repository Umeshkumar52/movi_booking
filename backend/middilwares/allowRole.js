export default function allowRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)){
     return res.status(403).json({
        message: "Sorry Access Denied !",
      });}
    next();
  };
}
