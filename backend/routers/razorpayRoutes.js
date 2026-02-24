import express from 'express'
import { createOrder, createSubscription, verifyPayment, verifySubscription } from '../controllers/razorpayController.js'

const router=express.Router()

router
.post('/create-order',createOrder)
.post('/verify',verifyPayment)
.post('/failed',verifyPayment)
.post('/subscription-create',createSubscription)
.post('/subscription-verify',verifySubscription)
export default router