import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllCollections = async (keyword, visibility, limit, page) => {
  const url = `${API_URL}/collections?keyword=${keyword}&visibility=${visibility}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailCollection = async (collection_id) => {
  const url = `${API_URL}/collections/${collection_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const setAddCollection = async (data) => {
  const url = `${API_URL}/collections`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setUpdateCollection = async (collection_id, data) => {
  const url = `${API_URL}/collections/${collection_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
