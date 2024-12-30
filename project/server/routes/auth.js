import express from 'express';
import { sendLoginOTP, verifyLoginOTP } from '../controllers/auth.js';

const router = express.Router();

router.post('/send-otp', sendLoginOTP);
router.post('/verify-otp', verifyLoginOTP);

export default router;