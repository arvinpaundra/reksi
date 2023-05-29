/* eslint-disable @next/next/no-img-element */

import Head from 'next/head';
import Card from '../../../../components/atoms/Card';
import Footer from '../../../../components/organisms/Footer';
import Navbar from '../../../../components/organisms/Navbar';
import SidebarStaff from '../../../../components/organisms/Sidebar/SidebarStaff';
import CardHeader from '../../../../components/atoms/Card/CardHeader';
import CardBody from '../../../../components/atoms/Card/CardBody';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import ImportantField from '../../../../components/atoms/Important';
import { Input } from '../../../../components/atoms/Input';
import { PatternFormat } from 'react-number-format';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Divider from '../../../../components/atoms/Divider';
import SelectDepartement from '../../../../components/mollecules/Select/Departement';
import CardFooter from '../../../../components/atoms/Card/CardFooter';
import { ButtonFilled } from '../../../../components/atoms/Button';
import jwtDecode from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDetailPemustaka, setUpdateProfilePemustaka } from '../../../../services/pemustaka';
import { toast } from 'react-toastify';
import SelectRole from '../../../../components/mollecules/Select/Role';
import SelectProdi from '../../../../components/mollecules/Select/Prodi';

const AdministratorEditPemustaka = ({ data }) => {
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
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
  const [departement, setDepartement] = useState('');
  const [studyProgram, setStudyProgram] = useState('');

  const router = useRouter();

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(pemustaka_id);

      setPemustaka(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: pemustaka_id } = router.query;

  useEffect(() => {
    getDetailPemustakaAPI(pemustaka_id);
  }, [getDetailPemustakaAPI, pemustaka_id]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('departement_id', pemustaka.departement_id || '');
    data.append('study_program_id', pemustaka.study_program_id || '');
    data.append('role_id', pemustaka.role_id || '');
    data.append('fullname', pemustaka?.fullname || '');
    data.append('email', pemustaka.email || '');
    data.append('identity_number', pemustaka?.identity_number || '');
    data.append('year_gen', pemustaka?.year_gen || '');
    data.append('gender', pemustaka?.gender || '');
    data.append('telp', pemustaka?.telp || '');
    data.append('birth_date', pemustaka?.birth_date || '');
    data.append('address', pemustaka?.address || '');
    data.append('is_collected_final_project', pemustaka.is_collected_final_project);
    data.append('is_collected_internship_report', pemustaka.is_collected_internship_report);
    data.append('is_active', pemustaka.is_active);
    data.append('avatar', avatar);

    try {
      setLoading(true);

      const response = await setUpdateProfilePemustaka(pemustaka_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Silahkan isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        setErrors({});
        return;
      }

      toast.success('Data pemustaka berhasil diperbaharui!', { toastId: 'success' });
      setErrors({});
      router.push('/administrator/pemustaka');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = ({ value, label }) => {
    setPemustaka({ ...pemustaka, role_id: value, role: label });
  };

  const handleDepartementChange = (data) => {
    setPemustaka({ ...pemustaka, departement_id: data.value });
    setDepartement({ id: data.value, name: data.label });
  };

  const handleProdiChange = ({ value }) => {
    setPemustaka({ ...pemustaka, study_program_id: value });
  };

  return (
    <div>
      <Head>
        <title>Edit Pemustaka</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Edit Pemustaka</h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Data Pribadi</h3>
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
                        src={pemustaka?.avatar}
                        alt=""
                        className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                      />
                    )}
                    <div className="w-full h-full absolute top-0 right-0 opacity-0 hover:opacity-100 hover:bg-orange/50 hover:transition hover:ease-in-out hover:duration-300 flex items-center justify-center cursor-pointer">
                      <AiOutlineCloudUpload color="white" size={28} />
                    </div>
                  </label>
                  {errors && <p className="text-red text-sm">{errors?.avatar}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="name">
                    Nama Pemustaka <ImportantField />
                  </label>
                  <Input
                    type="text"
                    placeholder="Nama Pemustaka"
                    value={pemustaka.fullname}
                    onChange={(event) =>
                      setPemustaka({ ...pemustaka, fullname: event.target.value })
                    }
                    error={errors?.fullname}
                  />
                  {errors && <p className="text-red text-sm">{errors?.fullname}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="email">
                    Email <ImportantField />
                  </label>
                  <Input
                    type="text"
                    placeholder="Email"
                    value={pemustaka.email}
                    onChange={(event) => setPemustaka({ ...pemustaka, email: event.target.value })}
                    error={errors?.email}
                  />
                  {errors && <p className="text-red text-sm">{errors?.email}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="email">
                    Pilih Role <ImportantField />
                  </label>
                  <SelectRole
                    error={errors?.role_id}
                    onRoleChange={handleRoleChange}
                    visibility="pemustaka"
                  />
                  {errors && <p className="text-red text-sm">{errors?.role_id}</p>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="telp">
                    No. Telepon
                  </label>
                  <Input
                    type="text"
                    placeholder="Nomor Telepon"
                    value={pemustaka.telp}
                    onChange={(event) => setPemustaka({ ...pemustaka, telp: event.target.value })}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="birth_date">
                    Tanggal Lahir
                  </label>
                  <PatternFormat
                    value={pemustaka.birth_date}
                    format="##-##-####"
                    placeholder="hh-bb-tttt"
                    displayType="input"
                    type="text"
                    onValueChange={(values, sourceInfo) =>
                      setPemustaka({ ...pemustaka, birth_date: values.formattedValue })
                    }
                    mask=" "
                    customInput={Input}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="gender">
                    Jenis Kelamin
                  </label>
                  <Listbox
                    value={pemustaka.gender}
                    onChange={(event) => setPemustaka({ ...pemustaka, gender: event })}
                  >
                    <div className="relative">
                      <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                        <span className="block truncate text-start">
                          {!pemustaka.gender?.length ? 'Belum diisi' : pemustaka.gender}
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
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="address">
                    Alamat
                  </label>
                  <textarea
                    className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                    placeholder="Alamat Pemustaka"
                    value={pemustaka.address}
                    onChange={(event) =>
                      setPemustaka({ ...pemustaka, address: event.target.value })
                    }
                  />
                </div>
              </div>

              <Divider />

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Informasi Akademik</h3>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-sm text-black" htmlFor="identity_number">
                    {pemustaka?.role === 'Mahasiswa' ? 'NIM' : 'NIDN'} <ImportantField />
                  </label>
                  <Input
                    type="text"
                    placeholder={
                      pemustaka?.role === 'Mahasiswa'
                        ? 'Nomor Induk Mahasiswa'
                        : 'Nomor Induk Dosen Nasional'
                    }
                    value={pemustaka.identity_number}
                    onChange={(event) =>
                      setPemustaka({ ...pemustaka, identity_number: event.target.value })
                    }
                    error={errors?.identity_number}
                  />
                  {errors && <p className="text-red text-sm">{errors?.identity_number}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="departement">
                    Jurusan <ImportantField />
                  </label>
                  <SelectDepartement
                    error={errors?.departement_id}
                    onDepartementChange={handleDepartementChange}
                  />
                  {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="study_program">
                    Program Studi <ImportantField />
                  </label>
                  <SelectProdi
                    error={errors?.study_program_id}
                    departement_id={pemustaka?.departement_id}
                    onProdiChange={handleProdiChange}
                  />
                  {errors && <p className="text-red text-sm">{errors?.study_program_id}</p>}
                </div>
                {pemustaka.role === 'Mahasiswa' && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-sm text-black" htmlFor="year_gen">
                      Tahun Angkatan
                    </label>
                    <Input
                      type="text"
                      placeholder="Tahun Angkatan"
                      value={pemustaka.year_gen}
                      onChange={(event) =>
                        setPemustaka({ ...pemustaka, year_gen: event.target.value })
                      }
                    />
                  </div>
                )}
                <div className="flex flex-col gap-1 w-full md:col-span-6">
                  <label className="text-sm text-black" htmlFor="gender">
                    Status <ImportantField />
                  </label>
                  <Listbox
                    value={pemustaka.is_active}
                    onChange={(value) => setPemustaka({ ...pemustaka, is_active: value })}
                  >
                    <div className="relative">
                      <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                        <span className="block truncate text-start">
                          {pemustaka.is_active === '1' ? 'Aktif' : 'Non Aktif'}
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

                {pemustaka.role === 'Mahasiswa' && (
                  <>
                    <div className="flex flex-col gap-1 w-full md:col-span-6">
                      <label className="text-sm text-black" htmlFor="gender">
                        Status Pengumpulan Laporan Tugas Akhir <ImportantField />
                      </label>
                      <Listbox
                        value={pemustaka.is_collected_final_project}
                        onChange={(value) =>
                          setPemustaka({ ...pemustaka, is_collected_final_project: value })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                            <span className="block truncate text-start">
                              {pemustaka.is_collected_final_project === '1'
                                ? 'Sudah Mengumpulkan'
                                : 'Belum Mengumpulkan'}
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
                              value="1"
                            >
                              Sudah Mengumpulkan
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 px-4 ${
                                  active ? 'bg-green/10 text-black' : 'text-secondary'
                                }`
                              }
                              value="0"
                            >
                              Belum Mengumpulkan
                            </Listbox.Option>
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>

                    <div className="flex flex-col gap-1 w-full md:col-span-6">
                      <label className="text-sm text-black" htmlFor="gender">
                        Status Pengumpulan Laporan Magang Industri <ImportantField />
                      </label>
                      <Listbox
                        value={pemustaka.is_collected_internship_report}
                        onChange={(value) =>
                          setPemustaka({ ...pemustaka, is_collected_internship_report: value })
                        }
                      >
                        <div className="relative">
                          <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                            <span className="block truncate text-start">
                              {pemustaka.is_collected_internship_report === '1'
                                ? 'Sudah Mengumpulkan'
                                : 'Belum Mengumpulkan'}
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
                              value="1"
                            >
                              Sudah Mengumpulkan
                            </Listbox.Option>
                            <Listbox.Option
                              className={({ active }) =>
                                `relative cursor-default select-none py-2 px-4 ${
                                  active ? 'bg-green/10 text-black' : 'text-secondary'
                                }`
                              }
                              value="0"
                            >
                              Belum Mengumpulkan
                            </Listbox.Option>
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                  </>
                )}
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
                <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handleUpdateProfile}>
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

export default AdministratorEditPemustaka;

const PatternFormatError = (props) => {
  return (
    <input
      className="border border-red rounded-xl py-2 px-4 outline-none focus:border-blue w-full"
      {...props}
    />
  );
};

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
