import { AES, enc } from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY;

// Function to encrypt data
export const encryptData = (value) => {
  const encryptedValue = AES.encrypt(value, SECRET_KEY).toString();
  return encryptedValue;
};

// Function to decrypt data
export const decryptData = (encryptedValue) => {
  try {
    if (!encryptedValue) {
      return "";
    }
    const bytes = AES.decrypt(encryptedValue, SECRET_KEY);

    if (!bytes) {
      return "";
    }
    const decryptedData = bytes.toString(enc.Utf8);
    return decryptedData || null;
  } catch (error) {
    console.error(`Error decrypting data`, error);
    return null;
  }
};
