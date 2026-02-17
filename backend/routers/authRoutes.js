import express from 'express'
import {register,login, refreshAccessToken, logout, authme, updateFmcToken} from '../controllers/authController.js'
import authenticate from '../middilwares/authenticate.js'
const router=express.Router()


router.post('/signup',register)
router.post('/login',login)

router.get('/refresh-token',refreshAccessToken)
router.get('/logout',logout)
router.get("/",authme)
router.patch("/update/fmcToken",authenticate,updateFmcToken)
export default router