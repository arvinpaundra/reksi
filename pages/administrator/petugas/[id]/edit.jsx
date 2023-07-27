/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { getDetailStaff, setUpdateStaff } from '../../../../services/staff';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Navbar from '../../../../components/organisms/Navbar';
import SidebarStaff from '../../../../components/organisms/Sidebar/SidebarStaff';
import Card from '../../../../components/atoms/Card';
import CardHeader from '../../../../components/atoms/Card/CardHeader';
import CardBody from '../../../../components/atoms/Card/CardBody';
import ImportantField from '../../../../components/atoms/Important';
import { Input } from '../../../../components/atoms/Input';
import SelectRole from '../../../../components/mollecules/Select/Role';
import Divider from '../../../../components/atoms/Divider';
import CardFooter from '../../../../components/atoms/Card/CardFooter';
import { ButtonFilled } from '../../../../components/atoms/Button';
import Footer from '../../../../components/organisms/Footer';
import jwtDecode from 'jwt-decode';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { regex } from '../../../../helper/regex';

const AdministratorEditPetugas = ({ data }) => {
  const [staff, setStaff] = useState({
    id: '',
    user_id: '',
    role_id: '',
    fullname: '',
    nip: '',
    email: '',
    role: '',
    telp: '',
    address: '',
    gender: '',
    birth_date: '',
    is_active: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const router = useRouter();

  const getDetailStaffAPI = useCallback(async (staff_id) => {
    try {
      setLoading(true);

      const response = await getDetailStaff(staff_id);

      setStaff(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: staff_id } = router.query;

  useEffect(() => {
    getDetailStaffAPI(staff_id);
  }, [getDetailStaffAPI, staff_id]);

  const handleRoleChange = ({ value }) => {
    setStaff({ ...staff, role_id: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('fullname', staff?.fullname || '');
    data.append('nip', staff?.nip || '');
    data.append('role_id', staff?.role_id || '');
    data.append('email', staff?.email || '');
    data.append('gender', staff?.gender || '');
    data.append('telp', staff?.telp || '');
    data.append('birth_date', staff?.birth_date || '');
    data.append('address', staff?.address || '');
    data.append('avatar', avatar || null);
    data.append('is_active', staff?.is_active || '');

    try {
      setLoading(true);
      const response = await setUpdateStaff(staff_id, data);

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

      toast.success('Yeay! Sukses mengubah data petugas.');
      setErrors({});
      router.push('/administrator/petugas');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Petugas Perpustakaan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Edit Petugas Perpustakaan</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-1 w-fit">
                <label htmlFor="avatar" className="relative rounded-full overflow-hidden">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => {
                      const img = event.target.files[0];
                      setImagePreview(URL.createObjectURL(img));

                      setAvatar(img);
                    }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Image"
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={staff?.avatar}
                      alt=""
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  )}
                  <div className="w-20 h-20 md:w-32 md:h-32 absolute top-0 right-0 opacity-0 hover:opacity-100 hover:bg-orange/50 hover:transition hover:ease-in-out hover:duration-300 flex items-center justify-center cursor-pointer">
                    <AiOutlineCloudUpload color="white" size={28} />
                  </div>
                </label>
                {errors && <p className="text-red text-sm">{errors?.avatar}</p>}
              </div>
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
                  defaultValue={staff?.role}
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
                  onChange={(event) =>
                    setStaff({ ...staff, nip: regex.numeric(event.target.value, 18) })
                  }
                  error={errors?.nip}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="title">
                  No. Telepon
                  <ImportantField />
                </label>
                <Input
                  type="text"
                  id="telp"
                  placeholder="No. Telepon"
                  value={staff.telp}
                  onChange={(event) =>
                    setStaff({ ...staff, telp: regex.numeric(event.target.value, 13) })
                  }
                  error={errors?.telp}
                />
                {errors && <p className="text-red text-sm">{errors?.telp}</p>}
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
              <div className="flex flex-col gap-1 w-full md:col-span-6">
                <label className="text-sm text-black" htmlFor="gender">
                  Jenis Kelamin
                </label>
                <Listbox
                  value={staff.gender}
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
                <label className="text-sm text-black" htmlFor="address">
                  Alamat
                </label>
                <textarea
                  className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                  placeholder="Alamat Petugas"
                  value={staff.address}
                  onChange={(event) => setStaff({ ...staff, address: event.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1 w-full md:col-span-6">
                <label className="text-sm text-black" htmlFor="gender">
                  Status
                </label>
                <Listbox
                  value={staff.is_active}
                  onChange={(value) => setStaff({ ...staff, is_active: value })}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                      <span className="block truncate text-start">
                        {staff.is_active === '1' ? 'Aktif' : 'Non Aktif'}
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

export default AdministratorEditPetugas;

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
