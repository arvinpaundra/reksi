import jwtDecode from 'jwt-decode';
import Footer from '../../../components/organisms/Footer';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Divider from '../../../components/atoms/Divider';
import ImportantField from '../../../components/atoms/Important';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Card from '../../../components/atoms/Card';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Navbar from '../../../components/organisms/Navbar';
import Head from 'next/head';
import SelectPemustaka from '../../../components/mollecules/Select/Pemustaka';
import { useState } from 'react';
import SelectCollection from '../../../components/mollecules/Select/Collection';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { API_URL } from '../../../constants';
import { AiOutlinePrinter } from 'react-icons/ai';
import SelectRepository from '../../../components/mollecules/Select/Repository';

const PustakawanSuratKeteranganPenyerahanLaporan = ({ data }) => {
  const [payloads, setPayloads] = useState({
    pemustaka_id: '',
    collection_id: '',
    repository_id: '',
  });
  const [loading, setLoading] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const handlePemustakaChange = (_, { value }) => {
    setPayloads({ ...payloads, pemustaka_id: value });
  };

  const handleCollectionChange = ({ value }) => {
    setPayloads({
      ...payloads,
      collection_id: value,
    });
  };

  const handleRepositoryChange = ({ value }) => {
    setPayloads({
      ...payloads,
      repository_id: value,
    });
  };

  const handlePrint = async () => {
    setErrors(null);

    if (!payloads.pemustaka_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pemustaka_id: 'This field is required',
      }));
    }

    if (!payloads.collection_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        collection_id: 'This field is required',
      }));
    }

    if (!payloads.repository_id) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        repository_id: 'This field is required',
      }));
    }

    if (Object.keys(errors).length !== 0) {
      return;
    }

    const data = {
      pemustaka_id: payloads.pemustaka_id,
      collection_id: payloads.collection_id,
      repository_id: payloads.repository_id,
    };

    try {
      setButtonLoading(true);

      const token = Cookies.get('token');

      const response = await axios({
        url: `${API_URL}/reports/surat-keterangan-penyerahan-laporan`,
        method: 'POST',
        data,
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 60000,
      });

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
      const res = error.response;

      if (res?.data?.code === 400) {
        setErrors(res?.data?.errors);
        toast.warning('Mohon isi data dengan lengkap', { toastId: 'warning' });
        return;
      }

      if (res?.data?.code >= 300) {
        toast.error(res?.data?.message);
        setErrors({});
        return;
      }
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Surat Keterangan Penyerahan Laporan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="pustakawan" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Surat Keterangan Penyerahan Laporan</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Pilih Pemustaka
                  <ImportantField />
                </label>
                <SelectPemustaka
                  error={errors?.pemustaka_id}
                  onPemustakaChange={handlePemustakaChange}
                />
                {errors && <p className="text-red text-sm">{errors?.pemustaka_id}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Pilih Koleksi
                  <ImportantField />
                </label>
                <SelectCollection
                  error={errors?.collection_id}
                  onCollectionChange={handleCollectionChange}
                  visibility=""
                />
                {errors && <p className="text-red text-sm">{errors?.collection_id}</p>}
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Pilih Karya Tulis Ilmiah
                  <ImportantField />
                </label>
                <SelectRepository
                  collection_id={payloads.collection_id}
                  error={errors?.repository_id}
                  onRepositoryChange={handleRepositoryChange}
                  pemustaka_id={payloads.pemustaka_id}
                />
                {errors && <p className="text-red text-sm">{errors?.repository_id}</p>}
              </div>
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
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default PustakawanSuratKeteranganPenyerahanLaporan;

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
