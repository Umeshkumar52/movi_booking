import express from 'express'
import { createOrder } from '../controllers/notificationController.js'

const router=express.Router()

router.post('/send',createOrder)

export default router
