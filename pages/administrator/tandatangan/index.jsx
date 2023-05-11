/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Divider from '../../../components/atoms/Divider';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Footer from '../../../components/organisms/Footer';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Card from '../../../components/atoms/Card';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Navbar from '../../../components/organisms/Navbar';
import Head from 'next/head';
import { ButtonFilled } from '../../../components/atoms/Button';
import { useState } from 'react';
import ImportantField from '../../../components/atoms/Important';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { setUploadSignature } from '../../../services/staff';

const AdministratorTandatangan = ({ data }) => {
  const [signature, setSignature] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const { id: staff_id } = data;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('signature', signature);

    try {
      setLoading(true);
      const response = await setUploadSignature(staff_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warn('Mohon isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        setErrors({});
        return;
      }

      toast.success('Yeay! Sukses mengunggah tandatangan.');
      setErrors({});
      router.push('/administrator/profil');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Unggah Tandatangan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Unggah Tandatangan</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Pilih Gambar <span className="text-sm font-medium">(max. 1MB)</span>
                  <ImportantField />
                </label>
                <input
                  type="file"
                  accept={'image/*'}
                  id="signature"
                  className="hidden"
                  onChange={(event) => {
                    const img = event.target.files[0];
                    setImagePreview(URL.createObjectURL(img));
                    setSignature(img);
                  }}
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Profile Image" className="w-32 object-cover" />
                )}
                <div
                  className={`w-full border-dashed ${
                    errors?.signature ? 'border-red' : 'border-black/50'
                  } border-2 p-2 flex items-center justify-center rounded-xl`}
                >
                  <label
                    className={`p-2 w-32 lg:w-40 2xl:w-48 text-white text-center font-medium rounded-xl bg-blue/80 hover:bg-blue cursor-pointer`}
                    htmlFor="signature"
                  >
                    Pilih file
                  </label>
                </div>
                {errors && <p className="text-red text-sm">{errors?.signature}</p>}
              </div>
            </CardBody>

            <Divider />

            <CardFooter className="flex items-center justify-center p-6 gap-4">
              {loading && (
                <button
                  className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
                  disabled
                >
                  Memuat . . .
                </button>
              )}

              {!loading && (
                <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handleSubmit}>
                  Simpan
                </ButtonFilled>
              )}
            </CardFooter>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdministratorTandatangan;

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
