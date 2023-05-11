import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllRequestAccesses = async (keyword, status, limit, page) => {
  const url = `${API_URL}/request-accesses?keyword=${keyword}&status=${status}&limit=${limit}&page${page}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const getDetailRequestAccess = async (request_access_id) => {
  const url = `${API_URL}/request-accesses/${request_access_id}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const getTotalRequestAccess = async (status) => {
  const url = `${API_URL}/request-accesses/total?status=${status}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const setUpdateRequestAccess = async (request_access_id, data) => {
  const url = `${API_URL}/request-accesses/${request_access_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
