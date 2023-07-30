/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../components/organisms/Navbar';
import SidebarStaff from '../../components/organisms/Sidebar/SidebarStaff';
import { useCallback, useEffect, useState } from 'react';
import { getDetailStaff, setUpdateStaff } from '../../services/staff';
import Footer from '../../components/organisms/Footer';
import Card from '../../components/atoms/Card';
import CardHeader from '../../components/atoms/Card/CardHeader';
import CardBody from '../../components/atoms/Card/CardBody';
import ImportantField from '../../components/atoms/Important';
import { Input } from '../../components/atoms/Input';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import Divider from '../../components/atoms/Divider';
import CardFooter from '../../components/atoms/Card/CardFooter';
import { ButtonFilled } from '../../components/atoms/Button';
import { toast } from 'react-toastify';
import { FormatDateIntl } from '../../helper/format_date_intl';
import { regex } from '../../helper/regex';

const PustakawanProfil = ({ data }) => {
  const [isFetching, setIsFetching] = useState(true);
  const [enableEdit, setEnableEdit] = useState(false);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [staff, setStaff] = useState({
    id: '',
    user_id: '',
    role_id: '',
    fullname: '',
    email: '',
    role: '',
    telp: '',
    address: '',
    gender: '',
    birth_date: '',
    is_active: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });

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

  const { id: staff_id } = data;

  useEffect(() => {
    if (isFetching) {
      getDetailStaffAPI(staff_id);
    }

    setIsFetching(false);
  }, [getDetailStaffAPI, staff_id, isFetching]);

  const handleUpdateProfile = async (event) => {
    setIsFetching(true);
    event.preventDefault();

    const data = new FormData();

    data.append('fullname', staff?.fullname || '');
    data.append('role_id', staff?.role_id);
    data.append('email', staff?.email);
    data.append('gender', staff?.gender || '');
    data.append('telp', staff?.telp || '');
    data.append('birth_date', staff?.birth_date || '');
    data.append('address', staff?.address || '');
    data.append('avatar', avatar || null);
    data.append('is_active', staff?.is_active);

    try {
      setLoading(true);

      const response = await setUpdateStaff(staff_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Silahkan isi data sesuai dengan petunjuk.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        setErrors({});
        return;
      }

      toast.success('Data profil berhasil diperbaharui!', { toastId: 'success' });
      setErrors({});
      setEnableEdit(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Profil Pustakawan</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="pustakawan" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Profil Petugas</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Data Pribadi</h3>
                <div className="flex flex-col gap-1 w-fit">
                  {enableEdit ? (
                    <>
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
                        <div className="w-full h-full absolute top-0 right-0 opacity-0 hover:opacity-100 hover:bg-orange/50 hover:transition hover:ease-in-out hover:duration-300 flex items-center justify-center cursor-pointer">
                          <AiOutlineCloudUpload color="white" size={28} />
                        </div>
                      </label>
                      {errors && <p className="text-red text-sm">{errors?.avatar}</p>}
                    </>
                  ) : (
                    <img
                      src={staff?.avatar}
                      alt="Profile Image"
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                    htmlFor="name"
                  >
                    Nama Lengkap {enableEdit && <ImportantField />}
                  </label>
                  {enableEdit ? (
                    <>
                      <Input
                        type="text"
                        placeholder="Nama Lengkap"
                        value={staff.fullname}
                        onChange={(event) => setStaff({ ...staff, name: event.target.value })}
                        error={errors?.fullname}
                      />
                      {errors && <p className="text-red text-sm">{errors?.fullname}</p>}
                    </>
                  ) : (
                    <p>{staff.fullname}</p>
                  )}
                </div>

                {!enableEdit && (
                  <div className="flex flex-col gap-1">
                    <label
                      className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <p>{staff.email}</p>
                  </div>
                )}

                <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                  <div className="flex flex-col gap-1 w-full md:col-span-6">
                    <label
                      className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                      htmlFor="telp"
                    >
                      NIP
                    </label>
                    {enableEdit ? (
                      <Input
                        type="text"
                        placeholder="NIP"
                        value={staff.nip}
                        onChange={(event) =>
                          setStaff({ ...staff, nip: regex.numeric(event.target.value, 18) })
                        }
                      />
                    ) : (
                      <p>{!staff.nip?.length ? 'Belum diisi' : staff.nip}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full md:col-span-6">
                    <label
                      className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                      htmlFor="telp"
                    >
                      No. Telepon
                    </label>
                    {enableEdit ? (
                      <Input
                        type="text"
                        placeholder="Nomor Telepon"
                        value={staff.telp}
                        onChange={(event) =>
                          setStaff({ ...staff, telp: regex.numeric(event.target.value, 13) })
                        }
                      />
                    ) : (
                      <p>{!staff.telp?.length ? 'Belum diisi' : staff.telp}</p>
                    )}
                  </div>
                </div>

                <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                  <div className="flex flex-col gap-1 w-full md:col-span-6">
                    <label
                      className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                      htmlFor="birth_date"
                    >
                      Tanggal Lahir
                    </label>
                    {enableEdit ? (
                      <Input
                        type="date"
                        id="date_validated"
                        value={staff.birth_date}
                        onChange={(event) => setStaff({ ...staff, birth_date: event.target.value })}
                      />
                    ) : (
                      <p>
                        {!staff.birth_date?.length
                          ? 'Belum diisi'
                          : FormatDateIntl(staff.birth_date)}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 w-full md:col-span-6">
                    <label
                      className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                      htmlFor="gender"
                    >
                      Jenis Kelamin
                    </label>
                    {enableEdit ? (
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
                              <RiArrowDropDownLine
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
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
                    ) : (
                      <p>{!staff.gender?.length ? 'Belum diisi' : staff.gender}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label
                    className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                    htmlFor="address"
                  >
                    Alamat
                  </label>
                  {enableEdit ? (
                    <textarea
                      className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                      placeholder="Alamat Petugas"
                      value={staff.address}
                      onChange={(event) => setStaff({ ...staff, address: event.target.value })}
                    />
                  ) : (
                    <p>{!staff.address?.length ? 'Belum diisi' : staff.address}</p>
                  )}
                </div>
              </div>
            </CardBody>

            <Divider />

            <CardFooter className="flex items-center justify-center p-6 gap-4">
              {enableEdit ? (
                loading ? (
                  <button
                    className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
                    disabled
                  >
                    Memuat . . .
                  </button>
                ) : (
                  <>
                    <button
                      className="p-2 w-40 lg:w-40 2xl:w-48 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5"
                      onClick={() => {
                        setEnableEdit(false);
                        setIsFetching(true);
                      }}
                    >
                      Batal
                    </button>
                    <ButtonFilled
                      bgcolor="bg-green/80 hover:bg-green"
                      onClick={handleUpdateProfile}
                    >
                      Simpan
                    </ButtonFilled>
                  </>
                )
              ) : (
                <ButtonFilled
                  bgcolor="bg-blue/80 hover:bg-blue"
                  onClick={() => {
                    setEnableEdit((prevState) => !prevState);
                    setImagePreview(null);
                  }}
                >
                  Edit Profil
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

export default PustakawanProfil;

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
