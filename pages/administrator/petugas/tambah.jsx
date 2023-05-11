import jwtDecode from 'jwt-decode';
import { ButtonFilled } from '../../../components/atoms/Button';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Divider from '../../../components/atoms/Divider';
import Footer from '../../../components/organisms/Footer';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Card from '../../../components/atoms/Card';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import CardBody from '../../../components/atoms/Card/CardBody';
import ImportantField from '../../../components/atoms/Important';
import { Input } from '../../../components/atoms/Input';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import SelectRole from '../../../components/mollecules/Select/Role';
import { setRegisterStaff } from '../../../services/auth';

const AdministratorTambahPetugas = ({ data }) => {
  const [staff, setStaff] = useState({
    fullname: '',
    role_id: '',
    email: '',
    nip: '',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      fullname: staff.fullname,
      role_id: staff.role_id,
      email: staff.email,
      nip: staff.nip,
    };

    try {
      setLoading(true);
      const response = await setRegisterStaff(data);

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

      toast.success('Yeay! Sukses menambahkan role.');
      setErrors({});
      router.push('/administrator/petugas');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = ({ value }) => {
    setStaff({ ...staff, role_id: value });
  };

  return (
    <div>
      <Head>
        <title>Tambah Petugas Perpustakaan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Tambah Petugas Perpustakaan</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Nama Petugas
                  <ImportantField />
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Nama Petugas"
                  value={staff.fullname}
                  onChange={(event) => setStaff({ ...staff, fullname: event.target.value })}
                  error={errors?.fullname}
                />
                {errors && <p className="text-red text-sm">{errors?.fullname}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Pilih Role
                  <ImportantField />
                </label>
                <SelectRole
                  visibility="petugas"
                  onRoleChange={handleRoleChange}
                  error={errors?.role_id}
                />
                {errors && <p className="text-red text-sm">{errors?.role_id}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  Email Petugas
                  <ImportantField />
                </label>
                <Input
                  type="text"
                  id="email"
                  placeholder="Email Petugas"
                  value={staff.email}
                  onChange={(event) => setStaff({ ...staff, email: event.target.value })}
                  error={errors?.email}
                />
                {errors && <p className="text-red text-sm">{errors?.email}</p>}
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="title">NIP</label>
                <Input
                  type="text"
                  id="nip"
                  placeholder="Email Petugas"
                  value={staff.nip}
                  onChange={(event) => setStaff({ ...staff, nip: event.target.value })}
                  error={errors?.nip}
                />
              </div>
              <div className="flex flex-col gap-1 w-fit">
                <label htmlFor="title">
                  <ImportantField /> Kata sandi : abcd1234
                </label>
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

export default AdministratorTambahPetugas;

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
