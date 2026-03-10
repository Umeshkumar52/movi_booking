import eventEmitter from './eventEmitter.js';
import sendEmail from '../utils/sendEmail.js';
eventEmitter.on('movie_booking_mail', async (mailOptions) => {
   console.log("email event callled")
   sendEmail(mailOptions)
})

eventEmitter.on('subscription_mail', async (mailOptions) => {
   sendEmail(mailOptions)
})

eventEmitter.on('subscription_expire_mail', async (mailOptions) => {
   sendEmail(mailOptions)
})