import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getDashboardOverview = async () => {
  const url = `${API_URL}/dashboard/overview`;

  return callAPI({ url, method: 'GET', token: true });
};
