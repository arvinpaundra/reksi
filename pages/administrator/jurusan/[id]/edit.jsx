import jwtDecode from 'jwt-decode';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Footer from '../../../../components/organisms/Footer';
import { ButtonFilled } from '../../../../components/atoms/Button';
import CardFooter from '../../../../components/atoms/Card/CardFooter';
import Divider from '../../../../components/atoms/Divider';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import ImportantField from '../../../../components/atoms/Important';
import CardBody from '../../../../components/atoms/Card/CardBody';
import { Input } from '../../../../components/atoms/Input';
import CardHeader from '../../../../components/atoms/Card/CardHeader';
import Card from '../../../../components/atoms/Card';
import SidebarStaff from '../../../../components/organisms/Sidebar/SidebarStaff';
import Navbar from '../../../../components/organisms/Navbar';
import Head from 'next/head';
import { toast } from 'react-toastify';
import { getDetailDepartement, setEditDepartement } from '../../../../services/departement';

const AdministratorEditJurusan = ({ data }) => {
  const [departement, setDepartement] = useState({
    name: '',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const getDetailDepartementAPI = useCallback(async (departement_id) => {
    try {
      setLoading(true);
      const response = await getDetailDepartement(departement_id);

      setDepartement(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: departement_id } = router.query;

  useEffect(() => {
    getDetailDepartementAPI(departement_id);
  }, [getDetailDepartementAPI, departement_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      name: departement.name,
    };

    try {
      setLoading(true);
      const response = await setEditDepartement(departement_id, data);

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

      toast.success('Yeay! Sukses edit jurusan.');
      setErrors({});
      router.push('/administrator/jurusan');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Jurusan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Edit Jurusan</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Nama Jurusan
                  <ImportantField />
                </label>
                <Input
                  type="text"
                  id="koleksi"
                  placeholder="Nama Koleksi"
                  value={departement.name}
                  onChange={(event) => setDepartement({ ...departement, name: event.target.value })}
                  error={errors?.name}
                />
                {errors && <p className="text-red text-sm">{errors?.name}</p>}
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

export default AdministratorEditJurusan;

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
