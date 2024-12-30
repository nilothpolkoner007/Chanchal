import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  // Configure your email service
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendPaymentConfirmation = async (email, transaction) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Payment Confirmation',
    html: `
      <h1>Payment Successful</h1>
      <p>Transaction ID: ${transaction.transactionId}</p>
      <p>Amount: ₹${transaction.amount}</p>
      <p>Date: ${new Date(transaction.createdAt).toLocaleString()}</p>
    `
  };

  await transporter.sendMail(mailOptions);
};