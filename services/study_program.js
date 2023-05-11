import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getAllStudyPrograms = async (keyword, limit, page) => {
  const url = `${API_URL}/study-programs?keyword=${keyword}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getDetailStudyProgram = async (study_program_id) => {
  const url = `${API_URL}/study-programs/${study_program_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getStudyProgramsByDepartement = async (departement_id) => {
  const url = `${API_URL}/departements/${departement_id}/study-programs`;

  return callAPI({ url, method: 'GET', token: false });
};

export const setAddStudyProgram = async (data) => {
  const url = `${API_URL}/study-programs`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setEditStudyProgram = async (study_program_id, data) => {
  const url = `${API_URL}/study-programs/${study_program_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};
