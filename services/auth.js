import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const setLoginPemustaka = async (data) => {
  const url = `${API_URL}/auth/pemustaka/login`;

  return callAPI({ url, method: 'POST', data, token: false });
};

export const setRegisterPemustaka = async (data) => {
  const url = `${API_URL}/auth/pemustaka/register`;

  return callAPI({ url, method: 'POST', data, token: false });
};

export const setLoginStaff = async (data) => {
  const url = `${API_URL}/auth/staff/login`;

  return callAPI({ url, method: 'POST', data, token: false });
};

export const setRegisterStaff = async (data) => {
  const url = `${API_URL}/auth/staff/register`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setForgotPassword = async (data) => {
  const url = `${API_URL}/auth/forgot-password`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const setSendEmailForgotPassword = async (data) => {
  const url = `${API_URL}/auth/forgot-password`;

  return callAPI({ url, method: 'POST', data, token: false });
};

export const setChangePassword = async (user_id, data) => {
  const url = `${API_URL}/auth/users/${user_id}/change-password`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
