import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllStaffs = async (keyword, role_id, limit, page) => {
  const url = `${API_URL}/staffs?keyword=${keyword}&role_id=${role_id}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const getDetailStaff = async (staff_id) => {
  const url = `${API_URL}/staffs/${staff_id}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const setUploadSignature = async (staff_id, data) => {
  const url = `${API_URL}/staffs/${staff_id}/signatures`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const setUpdateStaff = async (staff_id, data) => {
  const url = `${API_URL}/staffs/${staff_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
