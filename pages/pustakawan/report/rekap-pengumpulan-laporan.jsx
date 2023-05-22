import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import Navbar from '../../../components/organisms/Navbar';
import Footer from '../../../components/organisms/Footer';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import SelectCollection from '../../../components/mollecules/Select/Collection';
import { getRecapCollectedReport } from '../../../services/report';
import Divider from '../../../components/atoms/Divider';
import { AiOutlinePrinter } from 'react-icons/ai';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_URL } from '../../../constants';

const KepalaPerpustakaanRekapPengumpulanLaporan = ({ data }) => {
  const [report, setReport] = useState({
    items: [],
    total: 0,
  });
  const [filter, setFilter] = useState({
    year_gen: '',
    collection_id: '',
  });
  const [loading, setLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [yearGen, setYearGen] = useState('');
  const [collection, setCollection] = useState('');
  const [errors, setErrors] = useState({});

  const getRecapCollectedReportAPI = useCallback(async (year_gen, collection_id) => {
    try {
      setLoading(true);
      const response = await getRecapCollectedReport(year_gen, collection_id);

      const total = response?.data.reduce((acc, curr) => {
        return acc + curr?.pemustaka_count;
      }, 0);

      setReport({
        items: [...response?.data],
        total: total,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRecapCollectedReportAPI(filter.year_gen, filter.collection_id);
  }, [getRecapCollectedReportAPI, filter]);

  const handleCollectionChange = ({ value }) => {
    setCollection(value);
  };

  const handleFilter = async (event) => {
    event.preventDefault();

    setFilter({
      year_gen: yearGen,
      collection_id: collection,
    });
  };

  const handlePrint = async () => {
    if (collection === '' || collection === undefined) {
      setErrors({
        collection_id: 'This field is required',
      });
      return;
    }

    try {
      const token = Cookies.get('token');
      setButtonLoading(true);

      const response = await axios.get(
        `${API_URL}/reports/recap-collected-report/download?collection_id=${collection}&year_gen=${yearGen}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
          timeout: 60000,
        },
      );

      const contentType = response.headers['content-type'];

      if (contentType === 'application/pdf') {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
        window.URL.revokeObjectURL(url);
        setErrors({});
      }
    } catch (error) {
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Rekap Pengumpulan Laporan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="pustakawan" />

          <div className="flex flex-col gap-4 xl:col-span-9">
            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
              <CardBody className="p-4 flex flex-col gap-3">
                <h3 className="font-semibold text-base md:text-xl">Rekap pengumpulan laporan</h3>
                <form className="flex gap-4" onSubmit={handleFilter}>
                  <div className="flex flex-col gap-1 w-full">
                    <input
                      type="text"
                      className={`border ${
                        errors?.year_gen ? 'border-red' : 'border-black/50'
                      } rounded-xl py-2.5 px-4 outline-none focus:border-blue`}
                      placeholder="Tahun Angkatan"
                      value={yearGen}
                      onChange={(event) => setYearGen(event.target.value)}
                    />
                    {errors && <p className="text-red text-sm">{errors?.year_gen}</p>}
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <SelectCollection
                      error={errors?.collection_id}
                      onCollectionChange={handleCollectionChange}
                      visibility=""
                    />
                    {errors && <p className="text-red text-sm">{errors?.collection_id}</p>}
                  </div>
                  <button
                    type="submit"
                    className="py-2.5 px-6 text-white h-fit font-medium rounded-xl bg-blue/80 hover:bg-blue hidden md:block border border-transparent"
                    onClick={handleFilter}
                  >
                    Cari
                  </button>
                </form>
              </CardBody>
            </Card>

            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
              <CardBody className="px-4 flex flex-col gap-3">
                <table className="w-full text-black/90 py-2">
                  <thead className="font-semibold text-center">
                    <tr className="border-b border-gray/30">
                      <td className="py-4">No.</td>
                      <td className="py-4">Program Studi</td>
                      <td className="py-4">Jumlah</td>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {loading && (
                      <tr>
                        <td
                          colSpan={7}
                          className="pt-8 pb-2 animate-pulse text-black/90 tracking-wide"
                        >
                          Loading . . .
                        </td>
                      </tr>
                    )}

                    {!loading &&
                      report?.items?.map((item, index) => (
                        <tr className="even:bg-blue/5 hover:bg-blue/5" key={index}>
                          <td className="py-6">{index + 1}.</td>
                          <td className="py-6">{item.study_program}</td>
                          <td className="py-6">{item.pemustaka_count}</td>
                        </tr>
                      ))}
                    <tr className="even:bg-blue/5 hover:bg-blue/5 font-semibold border-t border-gray/30">
                      <td colSpan={2} className="py-6 text-center">
                        Total Karya Tulis Ilmiah
                      </td>
                      <td className="py-6">{report.total}</td>
                    </tr>
                  </tbody>
                </table>
              </CardBody>

              <Divider />

              <CardFooter className="flex items-center justify-center p-6 gap-4">
                {buttonLoading ? (
                  <button
                    className="flex items-center justify-center gap-2 p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop"
                    disabled
                  >
                    <AiOutlinePrinter size={18} />
                    <p className="font-medium text-sm">Mencetak . . .</p>
                  </button>
                ) : (
                  <button
                    onClick={handlePrint}
                    className="flex items-center justify-center gap-2 p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/80 hover:bg-green"
                  >
                    <AiOutlinePrinter size={18} />
                    <p className="font-medium text-sm">Cetak Rekap</p>
                  </button>
                )}
              </CardFooter>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default KepalaPerpustakaanRekapPengumpulanLaporan;

export function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (!token) {
    return {
      redirect: {
        destination: '/auth/petugas/masuk',
        permanent: false,
      },
    };
  }

  const payloads = jwtDecode(token);
  payloads.authenticated = true;

  if (payloads?.role === 'Mahasiswa') {
    return {
      redirect: {
        destination: '/mahasiswa/profil',
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
  } else if (payloads?.role === 'Administrator') {
    return {
      redirect: {
        destination: '/administrator/dashboard',
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
