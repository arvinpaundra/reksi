/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Sidebar from '../../../components/organisms/Sidebar';
import Navbar from '../../../components/organisms/Navbar';
import Footer from '../../../components/organisms/Footer';
import Head from 'next/head';
import { useState } from 'react';
import { useCallback } from 'react';
import { getDetailPemustaka } from '../../../services/pemustaka';
import { useEffect } from 'react';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import axios from 'axios';
import { API_URL } from '../../../constants';
import Cookies from 'js-cookie';

const MahasiswaEPerpus = ({ data }) => {
  const [pemustaka, setPemustaka] = useState({
    pemustaka_id: '',
    study_program_id: '',
    departement_id: '',
    role_id: '',
    user_id: '',
    fullname: '',
    email: '',
    study_program: '',
    departement: '',
    member_code: '',
    identity_number: '',
    is_active: '',
    role: '',
    gender: '',
    telp: '',
    birth_date: '',
    address: '',
    join_date: '',
    year_gen: '',
    is_active: '',
    is_collected_final_project: '',
    is_collected_internship_report: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });

  const [loading, setLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(null);

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);

      const response = await getDetailPemustaka(pemustaka_id);

      setPemustaka(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: pemustaka_id } = data;

  useEffect(() => {
    getDetailPemustakaAPI(pemustaka_id);
  }, [getDetailPemustakaAPI, pemustaka_id]);

  const handleDownload = async () => {
    try {
      setButtonLoading(true);
      const token = Cookies.get('token');

      const response = await axios.get(`${API_URL}/identity-card/${pemustaka_id}`, {
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // create a blob url from response data
      const blobUrl = URL.createObjectURL(response.data);

      // create a link element and set the href and download attributes
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'e-perpus';

      // append the link element to the document body and click it
      document.body.appendChild(link);
      link.click();

      // remove the link element from the document body
      document.body.removeChild(link);

      // revoke the the blob url to free up memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Kartu E-Perpustakaan</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <Sidebar data={data} />

            <div className="w-full rounded-lg overflow-hidden h-fit xl:col-span-9 overflow-x-auto">
              <div className="flex flex-col gap-4">
                {loading ? (
                  <div className="w-[450px] text-center p-4 font-medium text-sm bg-white rounded-lg">
                    <p>Loading . . .</p>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        width: '450px',
                        fontFamily: 'sans-serif',
                        padding: '16px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        backgroundImage: 'url(https://i.ibb.co/NL188dQ/white-wood.png)',
                        filter: 'opacity(80%)',
                      }}
                    >
                      <div
                        style={{
                          padding: '0px',
                          textAlign: 'center',
                          boxShadow: '0 0 1.5px 0px #b9b9b9',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex' }}>
                          <img
                            src="https://res.cloudinary.com/dxhv9xlwc/image/upload/v1683409867/assets/Politeknik_Negeri_Cilacap_r7erqo.png"
                            style={{
                              width: '64px',
                              margin: '0px',
                              padding: '10px 8px',
                              boxSizing: 'border-box',
                            }}
                            alt=""
                          />
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: '10px 0px 0',
                              boxSizing: 'border-box',
                              width: '100%',
                              color: '#000',
                            }}
                          >
                            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
                              KARTU E-PERPUSTAKAAN
                            </p>
                            <p style={{ fontSize: '16px', fontWeight: '600', margin: '0' }}>
                              POLITEKNIK NEGERI CILACAP
                            </p>
                          </div>
                          <div style={{ clear: 'both' }}></div>
                        </div>
                        <span
                          style={{
                            height: '1px',
                            display: 'block',
                            backgroundColor: '#000',
                            marginTop: '1px',
                          }}
                        ></span>

                        <div
                          style={{
                            width: '100%',
                            display: 'block',
                            padding: '10px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <div style={{ float: 'left', width: '100px' }}>
                            <img
                              src={pemustaka?.avatar}
                              alt="student image"
                              style={{
                                width: '85%',
                                borderRadius: '4px',
                                boxSizing: 'border-box',
                                objectFit: 'cover',
                              }}
                            />
                          </div>
                          <div
                            style={{
                              float: 'left',
                              width: 'calc(100% - 100px)',
                              padding: '0px 5px 0 15px',
                              boxSizing: 'border-box',
                              textAlign: 'left',
                              textTransform: 'capitalize',
                              marginBottom: '24px',
                            }}
                          >
                            <h3
                              style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                margin: '0 0 8px 0',
                              }}
                            >
                              {pemustaka?.fullname}
                            </h3>
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '300',
                                lineHeight: '17px',
                              }}
                            >
                              Member ID :
                              <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>
                                {' '}
                                {pemustaka?.member_code}{' '}
                              </span>
                            </p>
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '300',
                                lineHeight: '17px',
                              }}
                            >
                              Tgl. Bergabung :
                              <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>
                                {' '}
                                {new Date(pemustaka?.created_at).toLocaleDateString('in-IN', {
                                  day: '2-digit',
                                  month: 'long',
                                  year: 'numeric',
                                })}{' '}
                              </span>
                            </p>
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '300',
                                lineHeight: '17px',
                              }}
                            >
                              Jurusan :
                              <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>
                                {' '}
                                {pemustaka?.departement}{' '}
                              </span>
                            </p>
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '300',
                                lineHeight: '17px',
                              }}
                            >
                              Alamat :
                              <span style={{ fontWeight: '600', textTransform: 'uppercase' }}>
                                {' '}
                                {pemustaka?.address === '' ? 'Belum diisi' : pemustaka?.address}
                              </span>
                            </p>
                          </div>

                          <div
                            style={{
                              padding: '0 5px 0 15px',
                              boxSizing: 'border-box',
                              textAlign: 'right',
                              textTransform: 'capitalize',
                            }}
                          >
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '300',
                                lineHeight: '17px',
                              }}
                            >
                              Mengetahui
                            </p>
                            <p
                              style={{
                                fontSize: '11px',
                                margin: '0 0 3px 0',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                              }}
                            >
                              KEPALA PERPUSTAKAAN PNC
                            </p>
                          </div>

                          <div style={{ clear: 'both' }}></div>
                        </div>
                      </div>
                    </div>
                    {buttonLoading ? (
                      <button
                        className="p-3 flex items-center justify-center gap-2 rounded-lg bg-white border border-transparent w-[450px]"
                        disabled
                      >
                        <AiOutlineCloudDownload size={18} />
                        <p className="font-semibold text-sm">Mengunduh . . .</p>
                      </button>
                    ) : (
                      <button
                        onClick={handleDownload}
                        className="p-3 flex items-center justify-center gap-2 rounded-lg bg-white border border-transparent hover:bg-green/5 hover:border-green duration-100 ease-in-out w-[450px]"
                      >
                        <AiOutlineCloudDownload size={18} />
                        <p className="font-semibold text-sm">Unduh Kartu</p>
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MahasiswaEPerpus;

export function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/auth/masuk',
        permanent: false,
      },
    };
  }

  const payloads = jwtDecode(token);
  payloads.authenticated = true;

  if (payloads?.role === 'Administrator') {
    return {
      redirect: {
        destination: '/administrator/dashboard',
        permanent: false,
      },
    };
  } else if (payloads?.role === 'Dosen') {
    return {
      redirect: {
        destination: '/dosen/profil',
        permanent: false,
      },
    };
  } else if (payloads?.role === 'Pustakawan') {
    return {
      redirect: {
        destination: '/pustakawan/dashboard',
        permanent: false,
      },
    };
  } else if (payloads?.role === 'Kepala Perpustakaan') {
    return {
      redirect: {
        destination: '/kepala-perpustakaan/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {
      data: payloads,
    },
  };
}
