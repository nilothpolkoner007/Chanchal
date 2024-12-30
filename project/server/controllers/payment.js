import Transaction from '../models/Transaction.js';
import Appointment from '../models/Appointment.js';
import { sendPaymentConfirmation } from '../utils/notifications.js';

export const processPayment = async (req, res) => {
  try {
    const { appointmentId, paymentData } = req.body;

    // Verify payment with Google Pay
    const verified = await verifyGooglePayPayment(paymentData);
    if (!verified) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Create transaction record
    const transaction = await Transaction.create({
      appointmentId,
      userId: req.user._id,
      amount: paymentData.amount,
      paymentMethod: 'GOOGLE_PAY',
      status: 'SUCCESS',
      transactionId: paymentData.transactionId
    });

    // Update appointment status
    await Appointment.findByIdAndUpdate(appointmentId, {
      paymentStatus: 'PAID',
      transactionId: transaction._id
    });

    // Send confirmation
    await sendPaymentConfirmation(req.user.email, transaction);

    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyGooglePayPayment = async (paymentData) => {
  // Implement Google Pay payment verification logic
  return true; // Placeholder
};