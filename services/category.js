import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getCategories = async (keyword, limit, page) => {
  const url = `${API_URL}/categories?keyword=${keyword}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailCategory = async (category_id) => {
  const url = `${API_URL}/categories/${category_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const setUpdateCategory = async (category_id, data) => {
  const url = `${API_URL}/categories/${category_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const setAddCategory = async (data) => {
  const url = `${API_URL}/categories`;

  return callAPI({ url, method: 'POST', data, token: true });
};
