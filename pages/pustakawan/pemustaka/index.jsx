/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import Footer from '../../../components/organisms/Footer';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Paginate from '../../../components/mollecules/Pagination';
import Divider from '../../../components/atoms/Divider';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Drawer from 'react-modern-drawer';
import { getAllRoles } from '../../../services/role';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import { FormatDateIntl } from '../../../helper/format_date_intl';
import { getAllPemustaka, getDetailPemustaka } from '../../../services/pemustaka';
import { RiArrowDropDownLine } from 'react-icons/ri';
import SelectDepartement from '../../../components/mollecules/Select/Departement';
import { ROLE_DOSEN_ID } from '../../../constants';
import { Input } from '../../../components/atoms/Input';

const PustakawanPemustaka = ({ data }) => {
  const [pemustaka, setPemustaka] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [indexTab, setIndexTab] = useState(0);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedPemustaka, setSelectedPemustaka] = useState('');
  const [keyword, setKeyword] = useState('');
  const [departement, setDepartement] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [isCollectedFinalProject, setIsCollectedFinalProject] = useState('');
  const [isCollectedFinalProjectFilter, setIsCollectedFinalProjectFilter] = useState('Semua');
  const [yearGen, setYearGen] = useState('');
  const [yearGenFilter, setYearGenFilter] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllPemustakaAPI = useCallback(
    async (keyword, role, departement, is_collected_final_project, year_gen, limit, currPage) => {
      try {
        setLoading(true);
        const response = await getAllPemustaka(
          keyword,
          role,
          departement,
          is_collected_final_project,
          year_gen,
          limit,
          currPage,
        );

        setPemustaka(response?.data);
        setPages(response?.pagination?.total_pages);
        setCurrPage(response?.pagination?.page);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllPemustakaAPI(
        keyword,
        selectedRole,
        departement,
        isCollectedFinalProject,
        yearGen,
        limit,
        currPage,
      );
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    getAllPemustakaAPI,
    keyword,
    selectedRole,
    departement,
    isCollectedFinalProject,
    yearGen,
    limit,
    currPage,
  ]);

  const getAllRolesAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllRoles('pemustaka');

      setRoles(response?.data);
      setSelectedRole(response?.data[0]?.id);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllRolesAPI();
  }, [getAllRolesAPI]);

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  const handleFilter = (event) => {
    event.preventDefault();

    setCurrPage(0);
    setKeyword(query);
    setDepartement(departementFilter);
    setIsCollectedFinalProject(
      isCollectedFinalProjectFilter === 'Semua'
        ? ''
        : isCollectedFinalProjectFilter === 'Sudah Mengumpulkan'
        ? '1'
        : '0',
    );
    setYearGen(yearGenFilter);

    setIsOpenDrawer(false);
  };

  const handleTabChange = (index, role_id) => {
    setIndexTab(index);
    setSelectedRole(role_id);
    setCurrPage(0);
    setQuery('');
    setKeyword('');
    setDepartement('');
    setDepartementFilter('');
    setIsCollectedFinalProject('');
    setIsCollectedFinalProjectFilter('Semua');
    setYearGen('');
    setYearGenFilter('');
  };

  const handleClearFilter = () => {
    setQuery('');
    setKeyword('');
    setDepartement('');
    setDepartementFilter('');
    setIsCollectedFinalProject('');
    setIsCollectedFinalProjectFilter('Semua');
    setYearGen('');
    setYearGenFilter('');
  };

  const handleOpenModal = (value) => {
    setIsOpenModal(value);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer((prevState) => !prevState);
  };

  const handleDepartementChange = ({ value }) => {
    setDepartementFilter(value);
  };

  return (
    <>
      <div>
        <Head>
          <title>Manajemen Pemustaka</title>
        </Head>

        <div className="w-full min-h-screen">
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <SidebarStaff data={data} role="pustakawan" />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                  <h3 className="font-semibold text-base md:text-xl">Cari pemustaka</h3>
                  <form className="flex items-center gap-4" onSubmit={handleFilter}>
                    <input
                      type="text"
                      className="flex-grow border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                      placeholder="Cari berdasarkan nama . . ."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      className="py-2 px-6 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5 hidden md:block"
                      type="button"
                      onClick={toggleDrawer}
                    >
                      Tambah Filter
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-6 text-white font-medium rounded-xl bg-blue/80 hover:bg-blue hidden md:block"
                      onClick={handleFilter}
                    >
                      Cari
                    </button>
                  </form>
                  <button
                    className="font-medium text-sm text-blue md:hidden self-start"
                    onClick={toggleDrawer}
                    type="button"
                  >
                    Tambah Filter
                  </button>
                </CardBody>
              </Card>

              <Card className="w-full bg-white rounded-lg overflow-hidden">
                <CardBody className="w-full">
                  <div className="w-full flex flex-1 items-center">
                    {roles?.map((role, index) => (
                      <button
                        onClick={() => handleTabChange(index, role.id)}
                        className={`p-6 ${
                          indexTab === index ? 'bg-lynch text-white' : 'bg-white'
                        } font-semibold text-sm w-full hover:bg-lynch hover:text-white duration-200 ease-in-out`}
                        key={role.id}
                      >
                        {role.role}
                      </button>
                    ))}
                  </div>

                  <Divider />

                  <table className="w-full text-black/90 py-2">
                    <thead className="font-semibold text-center">
                      <tr className="border-b border-gray/30">
                        <td className="py-4">Nama Lengkap</td>
                        <td className="py-4">Jurusan</td>
                        <td className="py-4">Status</td>
                        <td className="py-4">Aksi</td>
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
                        selectedRole !== '' &&
                        pemustaka?.map((item) => (
                          <tr className="even:bg-blue/5 hover:bg-blue/5" key={item.id}>
                            <td className="py-6">{item.fullname}</td>
                            <td className="py-6">{item.departement}</td>
                            <td className="py-6">
                              {item.is_active === '1' ? 'Aktif' : 'Non Aktif'}
                            </td>
                            <td className="py-6">
                              <button
                                onClick={() => {
                                  setSelectedPemustaka(item.id);
                                  setIsOpenModal(true);
                                }}
                                className="bg-blue/80 rounded-xl px-6 py-2 text-white font-medium hover:bg-blue"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </CardBody>

                <Divider />

                <CardFooter className="flex flex-col items-center justify-center p-6 gap-5">
                  {pemustaka?.length > 0 && <Paginate pageChange={pageChange} pages={pages} />}

                  <Link href="/pustakawan/pemustaka/tambah">
                    <a className="py-2 px-6 text-white font-medium flex items-center justify-center gap-2 rounded-xl bg-green/80 hover:bg-green">
                      <MdOutlineAddCircleOutline className="text-white" />
                      Tambah
                    </a>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <DetailPemustakaModal
        handleOpen={handleOpenModal}
        open={isOpenModal}
        pemustaka_id={selectedPemustaka}
      />

      {/* Filter */}
      <Drawer
        open={isOpenDrawer}
        onClose={toggleDrawer}
        direction="right"
        size={400}
        lockBackgroundScroll={true}
      >
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg md:text-xl">Filter</h3>
        </div>

        <Divider />

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Jurusan
            </label>
            <SelectDepartement onDepartementChange={handleDepartementChange} />
          </div>
          {selectedRole !== ROLE_DOSEN_ID && (
            <>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="status" className="text-black/90">
                  Status Pengumpulan Tugas Akhir
                </label>
                <Listbox
                  value={isCollectedFinalProjectFilter}
                  onChange={(event) => setIsCollectedFinalProjectFilter(event)}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                      <span className="block truncate text-start">
                        {isCollectedFinalProjectFilter}
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
                        value="Semua"
                      >
                        Semua
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Sudah Mengumpulkan"
                      >
                        Sudah Mengumpulkan
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Belum Mengumpulkan"
                      >
                        Belum Mengumpulkan
                      </Listbox.Option>
                    </Listbox.Options>
                  </div>
                </Listbox>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="year_gen">Tahun Angkatan</label>
                <Input
                  type="text"
                  id="year_gen"
                  placeholder="Tahun Angkatan"
                  value={yearGenFilter}
                  onChange={(event) => setYearGenFilter(event.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="w-full flex items-center justify-between p-4">
          <button
            onClick={handleClearFilter}
            className="flex items-center justify-center p-2 w-40 2xl:w-48 hover:bg-red/10 rounded-lg text-red"
          >
            <p>Reset</p>
          </button>

          <button
            className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-orange/80 hover:bg-orange"
            onClick={handleFilter}
          >
            Cari
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default PustakawanPemustaka;

const DetailPemustakaModal = ({ pemustaka_id, open, handleOpen }) => {
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
    year_gen: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });
  const [loading, setLoading] = useState(null);

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

  useEffect(() => {
    if (open) {
      getDetailPemustakaAPI(pemustaka_id);
    }
  }, [getDetailPemustakaAPI, pemustaka_id, open]);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog className="relative z-10" open={open} onClose={() => handleOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0">
          <div className="flex items-center justify-center min-h-screen p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="fixed inset-0 overflow-y-auto py-8">
                <div className="flex min-h-full items-center justify-center">
                  <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                    <CardHeader className="p-6 2xl:p-8">
                      <h2 className="text-center font-semibold text-base md:text-lg lg:text-xl">
                        Detail Pemustaka
                      </h2>
                    </CardHeader>

                    <Divider />

                    <CardBody className="p-6 flex flex-col gap-4 w-full">
                      {loading ? (
                        <p className="text-center">Loading . . .</p>
                      ) : (
                        <>
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1 rounded-full overflow-hidden">
                              <img
                                src={pemustaka?.avatar}
                                alt="Profile Image"
                                className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                              />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Nama Lengkap
                                </p>
                                <p>{pemustaka.fullname}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Email
                                </p>
                                <p>{pemustaka.email}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Jurusan
                                </p>
                                <p>{pemustaka.departement}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Program Studi
                                </p>
                                <p>{pemustaka.study_program}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Member ID
                                </p>
                                <p>{pemustaka.member_code}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  {pemustaka.role === 'Mahasiswa' ? 'NIM' : 'NIDN'}
                                </p>
                                <p>{pemustaka.identity_number}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  Status
                                </p>
                                <p>{pemustaka.is_active === '1' ? 'Aktif' : 'Non Aktif'}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  Role
                                </p>
                                <p>{pemustaka.role}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="birth_date">
                                  Tanggal Lahir
                                </p>
                                <p>
                                  {!pemustaka.birth_date?.length
                                    ? 'Belum diisi'
                                    : FormatDateIntl(pemustaka.birth_date)}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="telp">
                                  No. Telepon
                                </p>
                                <p>{!pemustaka.telp?.length ? 'Belum diisi' : pemustaka.telp}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  Jenis Kelamin
                                </p>
                                <p>
                                  {!pemustaka.gender?.length ? 'Belum diisi' : pemustaka.gender}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="address">
                                  Alamat
                                </p>
                                <p>
                                  {!pemustaka.address?.length ? 'Belum diisi' : pemustaka.address}
                                </p>
                              </div>
                            </div>
                            {pemustaka.role === 'Mahasiswa' && (
                              <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                                <div className="flex flex-col gap-1 w-full md:col-span-6">
                                  <p className="text-sm text-secondary" htmlFor="gender">
                                    Tahun Angkatan
                                  </p>
                                  <p>
                                    {!pemustaka.year_gen?.length
                                      ? 'Belum diisi'
                                      : pemustaka.year_gen}
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardBody>

                    <Divider />

                    <CardFooter className="flex items-center justify-center gap-4 lg:gap-6 p-4">
                      <Link href={`/pustakawan/pemustaka/${pemustaka_id}/edit`}>
                        <a className="p-2 w-32 text-white text-center font-medium rounded-xl bg-blue/80 hover:bg-blue">
                          Edit
                        </a>
                      </Link>
                    </CardFooter>
                  </Dialog.Panel>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
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
