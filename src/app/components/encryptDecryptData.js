
import { AES, enc } from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Encrypt data
export const encryptData = (value) => {
  const encryptedValue = AES.encrypt(value, SECRET_KEY).toString();
  return encryptedValue;
};

// Decrypt data
export const decryptData = (encryptedValue) => {
  try {
    if (!encryptedValue || typeof encryptedValue !== "string") {
      return "";
    }
    const bytes = AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedData = bytes.toString(enc.Utf8);
    return decryptedData || "";
  } catch (error) {
    console.error(`Error decrypting data`, error);
    return "";
  }
};
