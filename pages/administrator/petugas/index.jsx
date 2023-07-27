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
import { getAllStaffs, getDetailStaff } from '../../../services/staff';
import { getAllRoles } from '../../../services/role';
import { Dialog, Transition } from '@headlessui/react';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import { FormatDateIntl } from '../../../helper/format_date_intl';

const AdministratorPetugas = ({ data }) => {
  const [staffs, setStaffs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [indexTab, setIndexTab] = useState(0);

  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStaff, setSelectedStaff] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllStaffsAPI = useCallback(async (keyword, role, limit, currPage) => {
    try {
      setLoading(true);
      const response = await getAllStaffs(keyword, role, limit, currPage);

      setStaffs(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      getAllStaffsAPI(keyword, selectedRole, limit, currPage);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [getAllStaffsAPI, keyword, selectedRole, limit, currPage]);

  const getAllRolesAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllRoles('petugas');

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
  };

  const handleTabChange = (index, role_id) => {
    setIndexTab(index);
    setSelectedRole(role_id);
    setCurrPage(0);
    setQuery('');
    setKeyword('');
  };

  const handleOpenModal = (value) => {
    setIsOpenModal(value);
  };

  return (
    <>
      <div>
        <Head>
          <title>Manajemen Petugas Perpustakaan</title>
        </Head>

        <div className="w-full min-h-screen">
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <SidebarStaff data={data} role="administrator" />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                  <h3 className="font-semibold text-base md:text-xl">Cari petugas perpustakaan</h3>
                  <form className="flex items-center gap-4" onSubmit={handleFilter}>
                    <input
                      type="text"
                      className="flex-grow border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                      placeholder="Cari berdasarkan nama . . ."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      type="submit"
                      className="py-2 px-6 text-white font-medium rounded-xl bg-blue/80 hover:bg-blue hidden md:block"
                      onClick={handleFilter}
                    >
                      Cari
                    </button>
                  </form>
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
                        <td className="py-4">Email</td>
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
                        staffs?.map((staff) => (
                          <tr className="even:bg-blue/5 hover:bg-blue/5" key={staff.id}>
                            <td className="py-6">{staff.fullname}</td>
                            <td className="py-6">{staff.email}</td>
                            <td className="py-6">
                              {staff.is_active === '1' ? 'Aktif' : 'Non Aktif'}
                            </td>
                            <td className="py-6">
                              <button
                                onClick={() => {
                                  setSelectedStaff(staff.id);
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
                  {staffs?.length > 0 && <Paginate pageChange={pageChange} pages={pages} />}

                  <Link href="/administrator/petugas/tambah">
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

      <DetailStaffModal handleOpen={handleOpenModal} open={isOpenModal} staff_id={selectedStaff} />
    </>
  );
};

export default AdministratorPetugas;

const DetailStaffModal = ({ staff_id, open, handleOpen }) => {
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

  useEffect(() => {
    if (open) {
      getDetailStaffAPI(staff_id);
    }
  }, [getDetailStaffAPI, staff_id, open]);

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
                        Detail Petugas
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
                                src={staff?.avatar}
                                alt="Profile Image"
                                className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                              />
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Nama Lengkap
                                </p>
                                <p>{staff.fullname}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  NIP
                                </p>
                                <p>{!staff.nip?.length ? 'Belum diisi' : staff.nip}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="email">
                                  Email
                                </p>
                                <p>{staff.email}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  Role
                                </p>
                                <p>{staff.role}</p>
                              </div>
                            </div>

                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="birth_date">
                                  Tanggal Lahir
                                </p>
                                <p>
                                  {!staff.birth_date?.length
                                    ? 'Belum diisi'
                                    : FormatDateIntl(staff.birth_date)}
                                </p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="telp">
                                  No. Telepon
                                </p>
                                <p>{!staff.telp?.length ? 'Belum diisi' : staff.telp}</p>
                              </div>
                            </div>
                            <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="gender">
                                  Jenis Kelamin
                                </p>
                                <p>{!staff.gender?.length ? 'Belum diisi' : staff.gender}</p>
                              </div>
                              <div className="flex flex-col gap-1 w-full md:col-span-6">
                                <p className="text-sm text-secondary" htmlFor="address">
                                  Alamat
                                </p>
                                <p>{!staff.address?.length ? 'Belum diisi' : staff.address}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <p className="text-sm text-secondary" htmlFor="gender">
                                Status
                              </p>
                              <p>{staff.is_active === '1' ? 'Aktif' : 'Non Aktif'}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </CardBody>

                    <Divider />

                    <CardFooter className="flex items-center justify-center gap-4 lg:gap-6 p-4">
                      <Link href={`/administrator/petugas/${staff_id}/edit`}>
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
