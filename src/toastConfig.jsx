import { toast } from 'react-toastify';

const toastConfig = {
  position: toast.POSITION.TOP_RIGHT,
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    backgroundColor: '#f0f0f0',
    color: '#000'
  }
};

export const showToastSuccess = (message) => {
  toast.success(message, toastConfig);
};

export const showToastError = (message) => {
  toast.error(message, toastConfig);
};
