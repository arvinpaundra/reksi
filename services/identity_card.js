import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getidentityCard = async (pemustaka_id) => {
  const url = `${API_URL}/identity-card/${pemustaka_id}`;

  return callAPI({ url, method: 'GET', token: true });
};
