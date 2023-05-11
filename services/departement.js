import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllDepartements = async (keyword, limit, page) => {
  const url = `${API_URL}/departements?keyword=${keyword}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailDepartement = async (departement_id) => {
  const url = `${API_URL}/departements/${departement_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const setAddDepartement = async (data) => {
  const url = `${API_URL}/departements`;

  return callAPI({ url, method: 'POST', data, token: true });
};
export const setEditDepartement = async (departement_id, data) => {
  const url = `${API_URL}/departements/${departement_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
