import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllRoles = async (visibility) => {
  const url = `${API_URL}/roles?visibility=${visibility}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailRole = async (role_id) => {
  const url = `${API_URL}/roles/${role_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const setAddRole = async (data) => {
  const url = `${API_URL}/roles`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setUpdateRole = async (role_id, data) => {
  const url = `${API_URL}/roles/${role_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
