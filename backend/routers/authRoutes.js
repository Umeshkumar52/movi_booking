import express, { Router } from 'express'
import {register,login, refreshAccessToken, logout, authme, updateFcmToken, googleAuth, forgotPassword, resetPassword} from '../controllers/authController.js'
import authenticate from '../middilwares/authenticate.js'
const router=express.Router()


router.post('/signup',register)
router.post('/login',login)
router.post('/google-auth',googleAuth)
router.get('/refresh-token',refreshAccessToken)
router.get('/logout',logout)
router.get("/",authme)
router.patch("/update/fcmToken",authenticate,updateFcmToken)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
export default router