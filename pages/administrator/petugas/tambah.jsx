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
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { regex } from '../../../helper/regex';

const AdministratorTambahPetugas = ({ data }) => {
  const [staff, setStaff] = useState({
    fullname: '',
    role_id: '',
    email: '',
    nip: '',
    birth_date: '',
    gender: '',
    telp: '',
    address: '',
    is_active: '0',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      fullname: staff?.fullname,
      role_id: staff?.role_id,
      email: staff?.email,
      nip: staff?.nip,
      birth_date: staff?.birth_date,
      gender: staff?.gender,
      telp: staff?.telp,
      address: staff?.address,
      is_active: staff?.is_active,
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

      toast.success('Yeay! Sukses menambahkan petugas.');
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
                  value={staff?.fullname}
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
                  value={staff?.email}
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
                  placeholder="NIP Petugas"
                  value={staff?.nip}
                  onChange={(event) =>
                    setStaff({ ...staff, nip: regex.numeric(event.target.value, 18) })
                  }
                  error={errors?.nip}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-black" htmlFor="birth_date">
                  Tanggal Lahir
                </label>
                <Input
                  type="date"
                  id="date_validated"
                  value={staff.birth_date}
                  onChange={(event) => setStaff({ ...staff, birth_date: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-black" htmlFor="gender">
                  Jenis Kelamin
                </label>
                <Listbox
                  value={staff?.gender}
                  onChange={(event) => setStaff({ ...staff, gender: event })}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                      <span className="block truncate text-start">
                        {!staff.gender?.length ? 'Belum diisi' : staff.gender}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Pria"
                      >
                        Pria
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Wanita"
                      >
                        Wanita
                      </Listbox.Option>
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-black" htmlFor="telp">
                  No. Telepon
                </label>
                <Input
                  type="text"
                  placeholder="Nomor Telepon"
                  value={staff?.telp}
                  onChange={(event) =>
                    setStaff({ ...staff, telp: regex.numeric(event.target.value, 13) })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-black" htmlFor="address">
                  Alamat
                </label>
                <textarea
                  className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                  placeholder="Alamat Pemustaka"
                  value={staff?.address}
                  onChange={(event) => setStaff({ ...staff, address: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:col-span-6">
                <label className="text-sm text-black" htmlFor="gender">
                  Status <ImportantField />
                </label>
                <Listbox
                  value={staff?.is_active}
                  onChange={(value) => setStaff({ ...staff, is_active: value })}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                      <span className="block truncate text-start">
                        {staff?.is_active === '1' ? 'Aktif' : 'Non Aktif'}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="1"
                      >
                        Aktif
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="0"
                      >
                        Non Aktif
                      </Listbox.Option>
                    </Listbox.Options>
                  </div>
                </Listbox>
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
