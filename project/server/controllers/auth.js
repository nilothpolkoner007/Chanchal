import https from 'https';
import User from '../models/User.js';
import { generateOTP, verifyOTP } from '../utils/otp.js';
import { sendOTP } from '../utils/notifications.js';
import jwt from 'jsonwebtoken';

const user_json_url = 'URL_OF_YOUR_JSON_FILE';

// Fetch user details from JSON URL
export const fetchUserDetails = async () => {
  return new Promise((resolve, reject) => {
    https
      .get(user_json_url, (res) => {
        let data = '';

        // A chunk of data has been received.
        res.on('data', (chunk) => {
          data += chunk;
        });

        // The whole response has been received.
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            const userDetails = {
              countryCode: jsonData.user_country_code,
              phoneNumber: jsonData.user_phone_number,
              firstName: jsonData.user_first_name,
              lastName: jsonData.user_last_name,
            };
            resolve(userDetails);
          } catch (err) {
            reject(`Failed to parse JSON data: ${err.message}`);
          }
        });
      })
      .on('error', (err) => {
        reject(`Error fetching user data: ${err.message}`);
      });
  });
};

// Send OTP for login
export const sendLoginOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    // Fetch additional user details (optional step)
    const userDetails = await fetchUserDetails();

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
        name: `${userDetails.firstName} ${userDetails.lastName}`,
        countryCode: userDetails.countryCode,
      });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP
    await sendOTP(phone, otp);

    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and login
export const verifyLoginOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const user = await User.findOne({
      phone,
      otpExpiry: { $gt: Date.now() }, // Check if OTP is still valid
    });

    if (!user || !verifyOTP(otp, user.otp)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Clear OTP
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
