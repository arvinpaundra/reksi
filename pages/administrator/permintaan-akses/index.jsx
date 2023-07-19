/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Footer from '../../../components/organisms/Footer';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Divider from '../../../components/atoms/Divider';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Paginate from '../../../components/mollecules/Pagination';
import Drawer from 'react-modern-drawer';
import {
  getAllRequestAccesses,
  getDetailRequestAccess,
  setUpdateRequestAccess,
} from '../../../services/request_access';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import { toast } from 'react-toastify';
import ImportantField from '../../../components/atoms/Important';

const AdminsitratorRequestAccess = ({ data }) => {
  const [requestAccesses, setRequestAccesses] = useState([]);
  const [reasons, setReasons] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalDenied, setOpenModalDenied] = useState(false);

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [selected, setSelected] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllRequestAccessesAPI = useCallback(async (keyword, status, limit, currPage) => {
    try {
      setLoading(true);
      const response = await getAllRequestAccesses(keyword, status, limit, currPage);

      setRequestAccesses(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllRequestAccessesAPI(keyword, status, limit, currPage);
  }, [getAllRequestAccessesAPI, keyword, status, limit, currPage]);

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer((prevState) => !prevState);
  };

  const handlerFilter = (event) => {
    event.preventDefault();

    setCurrPage(0);
    setKeyword(query);
    setStatus(
      statusFilter === 'Semua'
        ? ''
        : statusFilter === 'Menunggu konfirmasi'
        ? 'pending'
        : statusFilter === 'Disetujui'
        ? 'accepted'
        : 'denied',
    );

    setIsOpenDrawer(false);
  };

  const handlerClearFilter = () => {
    setStatusFilter('Semua');

    setQuery('');
    setKeyword('');
    setStatus('');
  };

  const handleOpenModal = (value) => {
    setOpenModal(value);
  };

  const handleOpenDeniedModal = () => {
    setOpenModal(false);
    setOpenModalDenied(true);
  };

  const handleDenied = async () => {
    setErrors(null);
    const data = {
      status: 'denied',
      reasons: reasons,
    };

    try {
      setLoading(true);
      const response = await setUpdateRequestAccess(selected, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap!', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Sukses tolak pemustaka.');
      setOpenModalDenied(false);
      setReasons('');
      window.location.reload();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Head>
          <title>Permintaan Akses</title>
        </Head>

        <div className="w-full min-h-screen">
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <SidebarStaff data={data} role="administrator" />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                  <h3 className="font-semibold text-base md:text-xl">Cari permintaan akses</h3>
                  <form className="flex items-center gap-4" onSubmit={handlerFilter}>
                    <input
                      type="text"
                      className="flex-grow border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                      placeholder="Cari berdasarkan nama pengguna . . ."
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
                      onClick={handlerFilter}
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
                <CardBody>
                  <table className="w-full text-black/90 py-2">
                    <thead className="font-semibold text-center">
                      <tr className="border-b border-gray/30">
                        <td className="py-4">Nama Lengkap</td>
                        <td className="py-4">Jurusan</td>
                        <td className="py-4">Role Pilihan</td>
                        <td className="py-4">Aksi</td>
                      </tr>
                    </thead>
                    <tbody className="text-center">
                      {loading ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="pt-8 pb-2 animate-pulse text-black/90 tracking-wide"
                          >
                            Loading . . .
                          </td>
                        </tr>
                      ) : (
                        requestAccesses?.map((item) => (
                          <tr className="even:bg-blue/5 hover:bg-blue/5" key={item.id}>
                            <td className="py-6">{item.pemustaka}</td>
                            <td className="py-6">{item.departement}</td>
                            <td className="py-6">{item.role}</td>
                            <td className="py-6">
                              <button
                                onClick={() => {
                                  setOpenModal((prevState) => !prevState);
                                  setSelected(item.id);
                                }}
                                className="bg-blue/80 rounded-xl px-6 py-2 text-white font-medium hover:bg-blue"
                              >
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardBody>

                <Divider />

                {requestAccesses?.length > 0 && (
                  <CardFooter className="flex flex-col items-center justify-center p-6 gap-5">
                    <Paginate pageChange={pageChange} pages={pages} />
                  </CardFooter>
                )}
              </Card>
            </div>
          </main>

          <Footer />
        </div>
      </div>

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
            <label htmlFor="status" className="text-black/90">
              Status
            </label>
            <Listbox value={statusFilter} onChange={(event) => setStatusFilter(event)}>
              <div className="relative">
                <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                  <span className="block truncate text-start">{statusFilter}</span>
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
                    value="Disetujui"
                  >
                    Disetujui
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Ditolak"
                  >
                    Ditolak
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Menunggu konfirmasi"
                  >
                    Menunggu konfirmasi
                  </Listbox.Option>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        <div className="w-full flex items-center justify-between p-4">
          <button
            onClick={handlerClearFilter}
            className="flex items-center justify-center p-2 w-40 2xl:w-48 hover:bg-red/10 rounded-lg text-red"
          >
            <p>Reset</p>
          </button>

          <button
            className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-orange/80 hover:bg-orange"
            onClick={handlerFilter}
          >
            Cari
          </button>
        </div>
      </Drawer>

      {/* Modal Detail */}
      <DetailModal
        handleOpen={handleOpenModal}
        handleOpenDeniedModal={handleOpenDeniedModal}
        open={openModal}
        request_id={selected}
      />

      {/* Modal Denied Request Access */}
      <Transition show={openModalDenied} as={Fragment}>
        <Dialog
          className="relative z-10"
          open={openModalDenied}
          onClose={() => {
            setOpenModalDenied(false);
            setErrors(null);
          }}
        >
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
                      <CardHeader className="p-4 2xl:p-8">
                        <h2 className="text-center font-semibold text-base md:text-lg lg:text-xl">
                          Alasan Penolakan Permintaan Akses
                        </h2>
                      </CardHeader>

                      <Divider />

                      <CardBody className="p-4 flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-1">
                          <label htmlFor="reasons">
                            Alasan
                            <ImportantField />
                          </label>
                          <textarea
                            className={`relative w-full border ${
                              errors?.reasons ? 'border-red' : 'border-black/50'
                            } rounded-xl py-2 px-4 outline-none focus:border-blue`}
                            placeholder="Deskripsikan alasan penolakan"
                            rows={5}
                            value={reasons}
                            onChange={(event) => setReasons(event.target.value)}
                          />
                          {errors && <p className="text-red text-sm">{errors?.reasons}</p>}
                        </div>
                      </CardBody>

                      <Divider />

                      <CardFooter className="flex items-center justify-center gap-4 lg:gap-6 p-4">
                        {loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Batal
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Simpan
                            </button>
                          </>
                        )}

                        {!loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/80 hover:bg-red"
                              onClick={() => {
                                setOpenModalDenied(false);
                                setOpenModal(true);
                                setErrors(null);
                                setReasons('');
                              }}
                            >
                              Batal
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/80 hover:bg-green"
                              onClick={handleDenied}
                            >
                              Simpan
                            </button>
                          </>
                        )}
                      </CardFooter>
                    </Dialog.Panel>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AdminsitratorRequestAccess;

const DetailModal = ({ request_id, open, handleOpen, handleOpenDeniedModal }) => {
  const [requestAccess, setRequestAccess] = useState({
    created_at: '',
    departement: '',
    id: '',
    identity_number: '',
    pemustaka: '',
    pemustaka_id: '',
    role: '',
    status: '',
    study_program: '',
    support_evidence: '',
    updated_at: '',
  });
  const [loading, setLoading] = useState(null);

  const getDetailRequestAccessAPI = useCallback(async (request_access_id) => {
    try {
      setLoading(true);
      const response = await getDetailRequestAccess(request_access_id);

      setRequestAccess(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      getDetailRequestAccessAPI(request_id);
    }
  }, [getDetailRequestAccessAPI, request_id, open]);

  const handleAccept = async () => {
    const data = {
      status: 'accepted',
    };

    try {
      setLoading(true);
      const response = await setUpdateRequestAccess(request_id, data);

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Sukses terima pemustaka.');
      handleOpen(false);
      window.location.reload();
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

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
                    <CardHeader className="p-4 2xl:p-8">
                      <h2 className="text-center font-semibold text-base md:text-lg lg:text-xl">
                        Detail Pemustaka
                      </h2>
                    </CardHeader>

                    <Divider />

                    <CardBody className="p-4 flex flex-col gap-4 w-full">
                      {loading ? (
                        <p className="text-center">Loading . . .</p>
                      ) : (
                        <>
                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Nama Lengkap</h3>
                            <p className="font-medium">{requestAccess?.pemustaka}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Role Dipilih</h3>
                            <p className="font-medium">{requestAccess?.role}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Jurusan</h3>
                            <p className="font-medium">{requestAccess?.departement}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Studi Program</h3>
                            <p className="font-medium">{requestAccess?.study_program}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">
                              {requestAccess?.role === 'Mahasiswa' ? 'NIM' : 'NIDN'}
                            </h3>
                            <p className="font-medium">{requestAccess?.identity_number}</p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Status</h3>
                            <p className="font-medium">
                              {requestAccess?.status === 'denied'
                                ? 'Ditolak'
                                : requestAccess?.status === 'accepted'
                                ? 'Diterima'
                                : 'Menunggu konfirmasi'}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1">
                            <h3 className="text-sm text-secondary">Bukti Pendukung</h3>
                            <img
                              src={requestAccess?.support_evidence}
                              alt={requestAccess?.pemustaka}
                              className="max-w-md self-center"
                            />
                          </div>
                        </>
                      )}
                    </CardBody>

                    <Divider />

                    {requestAccess?.status === 'pending' && (
                      <CardFooter className="flex items-center justify-center gap-4 lg:gap-6 p-4">
                        {loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Tolak
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Terima
                            </button>
                          </>
                        )}

                        {!loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/80 hover:bg-red"
                              onClick={handleOpenDeniedModal}
                            >
                              Tolak
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/80 hover:bg-green"
                              onClick={handleAccept}
                            >
                              Terima
                            </button>
                          </>
                        )}
                      </CardFooter>
                    )}
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
