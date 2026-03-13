function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

const mem = new Map();

export const otpService = {
  requestOtp(phone) {
    const otp = genOtp();
    mem.set(phone, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
    return otp;
  },
  verifyOtp(phone, otp) {
    if (!phone || !otp) return false;
    const row = mem.get(phone);
    if (!row) return false;
    if (Date.now() > row.expiresAt) return false;
    return row.otp === otp;
  }
};

