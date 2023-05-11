import { callAPI } from '../configs/api';
import { API_URL } from '../constants';

export const getSuratKeteranganPenyerahanLaporan = async (data) => {
  const url = `${API_URL}/reports/surat-keterangan-penyerahan-laporan`;

  return callAPI({ url, method: 'POST', data, token: true });
};

export const getRecapCollectedReport = async (year_gen, collection_id) => {
  const url = `${API_URL}/reports/recap-collected-report?year_gen=${year_gen}&collection_id=${collection_id}`;

  return callAPI({ url, method: 'GET', token: true });
};
