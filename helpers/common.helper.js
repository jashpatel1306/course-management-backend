/** 
 * @returns random 6 digits number(OTP)
 */  

const generateRandomOTP = () => {
  const length = 6;
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

module.exports = {
  generateRandomOTP,
};
