import { toast } from "react-toastify";

export const showError = (message: string): void => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showErrorBottom = (message: string): void => {
  toast.error(message, {
    position: "bottom-right",
    autoClose: 3000,
  });
};

export const showSuccess = (message: string): void => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showSuccessBottom = (message: string): void => {
  toast.success(message, {
    position: "bottom-right",
    autoClose: 3000,
  });
};
