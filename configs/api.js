import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

export const callAPI = async ({ url, method, data, token, serverToken }) => {
  let headers = {};

  if (serverToken) {
    headers = {
      Authorization: `Bearer ${serverToken}`,
    };
  } else if (token) {
    const jwtToken = Cookies.get('token');
    headers = {
      Authorization: `Bearer ${jwtToken}`,
    };
  }

  const response = await axios({ url, data, method, headers }).catch((err) => err.response);

  if (response.data?.code === 500) {
    const res = {
      code: response.data?.code,
      status: response.data?.status,
      message: response.data?.message,
    };

    return res;
  }

  if (response.status === 401 && response.data?.message === 'invalid or expired jwt') {
    toast.error('Sesi anda sudah berakhir, silahkan login kembali.', { toastId: 'error-401' });

    const res = {
      code: response.data?.code,
      status: response.data?.status,
      message: response.data?.message,
      data: null,
    };

    setTimeout(() => {
      Cookies.remove('token');
      window.location.href = '/auth/masuk';
    }, 3000);

    return res;
  }

  if (response.data?.code === 401 && response.data?.message === 'unauthorized') {
    toast.error('Yahh, sesi anda sudah berakhir.', { toastId: 'error-401' });

    const res = {
      code: response.data?.code,
      status: response.data?.status,
      message: response.data?.message,
      data: null,
    };

    Cookies.remove('token');

    window.location.href = '/auth/masuk';

    return res;
  }

  if (response.data?.code === 400 || response.data?.code === 415) {
    const res = {
      code: response.data?.code,
      status: response.data?.status,
      message: response.data?.message,
      errors: response.data?.errors,
    };

    return res;
  }

  if (response.status > 300) {
    const res = {
      code: response.data?.code,
      status: response.data?.status,
      message: response.data?.message,
    };

    return res;
  }

  const res = {
    code: response.data?.code,
    status: response.data?.status,
    message: response.data?.message,
    data: response.data?.data,
    pagination: response.data?.pagination,
  };

  return res;
};
