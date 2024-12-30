export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOTP = (inputOTP, storedOTP) => {
  return inputOTP === storedOTP;
};