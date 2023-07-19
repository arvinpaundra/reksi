import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getDetailRepository = async (repository_id) => {
  const url = `${API_URL}/repositories/${repository_id}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getAllRepositories = async (
  keyword,
  collection_id,
  category_id,
  departement_id,
  improvement,
  sort,
  status,
  year,
  limit,
  page,
) => {
  const url = `${API_URL}/repositories?keyword=${keyword}&collection_id=${collection_id}&category_id=${category_id}&departement_id=${departement_id}&improvement=${improvement}&sort=${sort}&status=${status}&year=${year}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: false });
};

export const getAuthorRepositories = async (
  pemustaka_id,
  keyword,
  collection_id,
  category_id,
  departement_id,
  improvement,
  status,
  sort,
  year,
  limit,
  page,
) => {
  const url = `${API_URL}/authors/${pemustaka_id}/repositories?keyword=${keyword}&collection_id=${collection_id}&category_id=${category_id}&departement_id=${departement_id}&improvement=${improvement}&status=${status}&sort=${sort}&year=${year}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const getMentoredRepositories = async (
  pemustaka_id,
  keyword,
  collection_id,
  category_id,
  departement_id,
  improvement,
  status,
  sort,
  year,
  limit,
  page,
) => {
  const url = `${API_URL}/mentors/${pemustaka_id}/repositories?keyword=${keyword}&collection_id=${collection_id}&category_id=${category_id}&departement_id=${departement_id}&improvement=${improvement}&status=${status}&sort=${sort}&year=${year}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const getExaminedRepositories = async (
  pemustaka_id,
  keyword,
  collection_id,
  category_id,
  departement_id,
  improvement,
  status,
  sort,
  year,
  limit,
  page,
) => {
  const url = `${API_URL}/examiners/${pemustaka_id}/repositories?keyword=${keyword}&collection_id=${collection_id}&category_id=${category_id}&departement_id=${departement_id}&improvement=${improvement}&status=${status}&sort=${sort}&year=${year}&limit=${limit}&page=${page}`;

  return callAPI({ url, method: 'GET', token: true });
};

export const setCreateFinalProjectReport = async (data) => {
  const url = `${API_URL}/repositories/final-projects`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setUpdateFinalProjectReport = async (repository_id, data) => {
  const url = `${API_URL}/repositories/final-projects/${repository_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const setDeleteAuthor = async (pemustaka_id, repository_id) => {
  const url = `${API_URL}/authors/${pemustaka_id}/repositories/${repository_id}`;

  return callAPI({ url, method: 'DELETE', token: true });
};

export const setCreateInternshipReport = async (data) => {
  const url = `${API_URL}/repositories/internship-reports`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setUpdateInternshipReport = async (repository_id, data) => {
  const url = `${API_URL}/repositories/internship-reports/${repository_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const setCreateResearchReport = async (data) => {
  const url = `${API_URL}/repositories/research-reports`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const setUpdateResearchReport = async (repository_id, data) => {
  const url = `${API_URL}/repositories/research-reports/${repository_id}`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const deleteRepository = async (repository_id) => {
  const url = `${API_URL}/repositories/${repository_id}`;

  return callAPI({ url, method: 'DELETE', token: true });
};

export const confirmRepository = async (repository_id, data) => {
  const url = `${API_URL}/repositories/${repository_id}/confirm`;

  return callAPI({ url, method: 'PUT', data, token: true });
};

export const getTotalRepositories = async (status) => {
  const url = `${API_URL}/repositories/total?status=${status}`;

  return callAPI({ url, method: 'GET', token: true });
};
