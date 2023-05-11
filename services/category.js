import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllCategories = async (keyword, limit, page) => {
  const url = `${API_URL}/categories?keyword=${keyword}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};
