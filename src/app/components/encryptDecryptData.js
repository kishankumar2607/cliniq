
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
      console.warn("Invalid encrypted value provided:", encryptedValue);
      return "";
    }

    const bytes = AES.decrypt(encryptedValue, SECRET_KEY);
    const decryptedData = bytes.toString(enc.Utf8);

    if (!decryptedData) {
      console.warn("Decryption resulted in empty or malformed UTF-8:", encryptedValue);
      return "";
    }

    return decryptedData;
  } catch (error) {
    console.error(`Error decrypting data for value: ${encryptedValue}`, error);
    return "";
  }
};

