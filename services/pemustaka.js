import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const setCreatePemustaka = async (data) => {
  const url = `${API_URL}/pemustaka`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const getAllPemustaka = async (
  keyword,
  role_id,
  departement_id,
  study_program_id,
  is_collected_final_project,
  year_gen,
  limit,
  page,
) => {
  const url = `${API_URL}/pemustaka?keyword=${keyword}&role_id=${role_id}&departement_id=${departement_id}&study_program_id=${study_program_id}&is_collected_final_project=${is_collected_final_project}&year_gen=${year_gen}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailPemustaka = async (pemustaka_id) => {
  const url = `${API_URL}/pemustaka/${pemustaka_id}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const setUpdateProfilePemustaka = async (pemustaka_id, data) => {
  const url = `${API_URL}/pemustaka/${pemustaka_id}`;

  return callAPI({ url, data: data, method: 'PUT', token: true });
};
