import express from 'express'
import { createOrder,failedPayment, createSubscription, verifyPayment, verifySubscription, webhookVerification } from '../controllers/razorpayController.js'

const router=express.Router()

router
.post('/create-order',createOrder)
.post('/verify',verifyPayment)
.post('/failed',failedPayment)
.post('/subscription-create',createSubscription)
.post('/subscription-verify',verifySubscription)
export default router