/* eslint-disable @next/next/no-img-element */
import { Dialog, Listbox, Transition } from '@headlessui/react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Link from 'next/link';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { FaBook, FaCheckCircle } from 'react-icons/fa';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Divider from '../../../components/atoms/Divider';
import Paginate from '../../../components/mollecules/Pagination';
import Footer from '../../../components/organisms/Footer';
import Navbar from '../../../components/organisms/Navbar';
import Sidebar from '../../../components/organisms/Sidebar';
import { getDetailPemustaka } from '../../../services/pemustaka';
import { getAuthorRepositories } from '../../../services/repository';
import Drawer from 'react-modern-drawer';
import Badge from '../../../components/atoms/Badge';
import SelectCollection from '../../../components/mollecules/Select/Collection';
import SelectDepartement from '../../../components/mollecules/Select/Departement';
import { FormatDateIntl } from '../../../helper/format_date_intl';

const PemustakaRepositori = (props) => {
  const { data } = props;

  const [repositories, setRepositories] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(null);

  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [collection, setCollection] = useState('');
  const [departement, setDepartement] = useState('');
  const [improvement, setImprovement] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('created_at DESC');

  const [collectionFilter, setCollectionFilter] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [improvementFilter, setImprovementFilter] = useState('Semua');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [sortFilter, setSortFilter] = useState('Terbaru');

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const getAuthorRepositoriesAPI = useCallback(
    async (
      pemustaka_id,
      keyword,
      collection_id,
      departement_id,
      improvement,
      status,
      sort,
      limit,
      page,
    ) => {
      try {
        setLoading(true);

        const response = await getAuthorRepositories(
          pemustaka_id,
          keyword,
          collection_id,
          departement_id,
          improvement,
          status,
          sort,
          limit,
          page,
        );

        setRepositories(response?.data);
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
    let payloads;

    const token = Cookies.get('token');

    if (token) {
      payloads = jwtDecode(token);
    }

    getAuthorRepositoriesAPI(
      payloads.id,
      keyword,
      collection,
      departement,
      improvement,
      status,
      sort,
      limit,
      currPage,
    );
  }, [
    getAuthorRepositoriesAPI,
    keyword,
    collection,
    departement,
    improvement,
    status,
    sort,
    limit,
    currPage,
  ]);

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
    setCollection(collectionFilter || '');
    setDepartement(departementFilter || '');
    setImprovement(
      improvementFilter === 'Semua' ? '' : improvementFilter === 'Hasil pengembangan' ? '1' : '0',
    );
    setStatus(
      statusFilter === 'Semua'
        ? ''
        : statusFilter === 'Menunggu konfirmasi'
        ? 'pending'
        : statusFilter === 'Disetujui'
        ? 'approved'
        : 'denied',
    );
    setSort(sortFilter === 'created_at DESC' ? 'crated_at DESC' : 'created_at ASC');

    setIsOpenDrawer(false);
  };

  const handlerClearFilter = () => {
    setCollectionFilter('');
    setDepartementFilter('');
    setImprovementFilter('Semua');
    setStatusFilter('Semua');
    setSortFilter('Terbaru');

    setQuery('');
    setKeyword('');
    setCollection('');
    setDepartement('');
    setImprovement('');
    setStatus('');
    setSort('created_at DESC');
  };

  const handleCollectionChange = ({ value }) => {
    setCollectionFilter(value);
  };

  const handleDepartementChange = ({ value }) => {
    setDepartementFilter(value);
  };

  return (
    <>
      <div>
        <Head>
          <title>Repositoriku</title>
        </Head>

        <div className="w-full min-h-screen flex flex-col justify-between">
          <div>
            <Navbar active="mahasiswa" />

            <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
              <Sidebar data={data} />

              <div className="flex flex-col gap-4 xl:col-span-9">
                <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                  <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                    <h3 className="font-semibold text-base md:text-xl">Cari di repositoriku</h3>
                    <form className="flex items-center gap-4" onSubmit={handlerFilter}>
                      <input
                        type="text"
                        className="flex-grow border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                        placeholder="Cari berdasarkan judul . . ."
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

                <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                  <CardBody>
                    {repositories?.length > 0 ? (
                      repositories?.map((item) => (
                        <Link href={`/mahasiswa/repositori/${item.id}`} key={item.id}>
                          <a>
                            <div className="p-4 md:px-6 lg:px-10 md:flex md:gap-4">
                              <img
                                src="/images/Rectangle.png"
                                alt=""
                                className="hidden md:block w-24 h-32"
                              />
                              <div>
                                <h3 className="text-base font-medium text-justify mb-1">
                                  {item.title}
                                </h3>
                                {item.authors?.map((author) => (
                                  <p className="text-sm text-secondary" key={author.author_id}>
                                    {author.fullname}
                                  </p>
                                ))}
                                <p className="text-sm text-secondary my-2">
                                  {FormatDateIntl(item.date_validated)}
                                </p>
                                <div className="flex items-center flex-wrap justify-start gap-2">
                                  <Badge borderColor="border-green" textColor="text-green">
                                    {item.collection}
                                  </Badge>
                                  <Badge borderColor="border-red" textColor="text-red">
                                    {item.departement}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Divider />
                          </a>
                        </Link>
                      ))
                    ) : (
                      <>
                        <div className="p-4 md:px-6 lg:px-10 flex flex-col justify-center items-center gap-4">
                          <img
                            src="/images/empty-repository.png"
                            alt="empty-repository"
                            className="w-48"
                          />
                          <p className="p-4 md:px-6 lg:px-10 text-center">
                            Tidak ada karya tulis ilmiah.
                          </p>
                        </div>

                        <Divider />
                      </>
                    )}
                  </CardBody>

                  {repositories?.length > 0 && (
                    <div className="pt-6 md:pt-6 pb-4 flex flex-col items-center justify-center">
                      <Paginate pageChange={pageChange} pages={pages} />
                    </div>
                  )}

                  <CardFooter className="p-4 flex flex-col items-center justify-center">
                    <button
                      className="py-2 px-6 text-white font-medium flex items-center justify-center gap-2 rounded-xl bg-green/80 hover:bg-green"
                      onClick={() => setIsOpenModal((prevState) => !prevState)}
                    >
                      <MdOutlineAddCircleOutline className="text-white" />
                      Buat Baru
                    </button>
                  </CardFooter>
                </Card>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>

      <AddRepoModal isOpen={isOpenModal} setIsOpenModal={setIsOpenModal} data={data} />

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
              Koleksi
            </label>
            <SelectCollection onCollectionChange={handleCollectionChange} visibility="" />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Jurusan
            </label>
            <SelectDepartement onDepartementChange={handleDepartementChange} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Pengembangan
            </label>
            <Listbox value={improvementFilter} onChange={(event) => setImprovementFilter(event)}>
              <div className="relative">
                <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                  <span className="block truncate text-start">{improvementFilter}</span>
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
                    value="Hasil pengembangan"
                  >
                    Hasil pengembangan
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Bukan hasil pengembangan"
                  >
                    Bukan hasil pengembangan
                  </Listbox.Option>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
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
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Urutkan berdasarkan
            </label>
            <Listbox value={sortFilter} onChange={(event) => setSortFilter(event)}>
              <div className="relative">
                <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                  <span className="block truncate text-start">{sortFilter}</span>
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
                    value="Terbaru"
                  >
                    Terbaru
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Terlama"
                  >
                    Terlama
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
    </>
  );
};

export default PemustakaRepositori;

const AddRepoModal = (props) => {
  const { data, isOpen, setIsOpenModal } = props;

  const [pemustaka, setPemustaka] = useState({
    is_collected_final_project: '',
    is_collected_internship_report: '',
  });
  const [loading, setLoading] = useState(null);

  const getDetailPemustakaAPI = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(id);

      setPemustaka(response?.data);
    } catch (error) {
    } finally {
      setLoading(true);
    }
  }, []);

  const { id: pemustaka_id } = data;

  useEffect(() => {
    getDetailPemustakaAPI(pemustaka_id);
  }, [getDetailPemustakaAPI, pemustaka_id]);

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-10" open={isOpen} onClose={() => setIsOpenModal(false)}>
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                <CardHeader className="p-5 md:p-6 2xl:p-8">
                  <h2 className="text-center font-semibold text-base md:text-lg lg:text-xl">
                    Pilih Jenis Repositori
                  </h2>
                </CardHeader>

                <Divider />

                <CardBody className="p-4 grid grid-cols-12 grid-rows-2 gap-4">
                  {pemustaka?.is_collected_final_project === '0' ? (
                    <Link href="/mahasiswa/repositori/tambah/tugas-akhir">
                      <a className="h-40 col-span-12 md:col-span-6 p-2 md:p-4 flex flex-col items-center justify-center hover:bg-black/5 border border-black/50 rounded-md">
                        <FaBook size={24} className="mb-4" />
                        <h5 className="font-medium text-lg text-center">Laporan Tugas Akhir</h5>
                        <p className="text-xs text-secondary">
                          Tambahkan deskripsi untuk Laporan Tugas Akhir.
                        </p>
                      </a>
                    </Link>
                  ) : (
                    <div
                      className="relative w-fit col-span-12 md:col-span-6"
                      title="Sudah mengumpulkan"
                    >
                      <FaCheckCircle size={18} className="absolute top-2 right-2 text-green" />
                      <div className="h-40 p-2 md:p-4 flex flex-col items-center justify-center bg-green/10 border border-green rounded-md">
                        <FaBook size={24} className="mb-4" />
                        <h5 className="font-medium text-lg text-center">Laporan Tugas Akhir</h5>
                        <p className="text-xs text-secondary">
                          Tambahkan deskripsi untuk Laporan Tugas Akhir.
                        </p>
                      </div>
                    </div>
                  )}

                  {pemustaka?.is_collected_internship_report === '0' ? (
                    <Link href="/mahasiswa/repositori/tambah/magang-industri">
                      <a className="h-40 col-span-12 md:col-span-6 p-2 md:p-4 flex flex-col items-center justify-center hover:bg-black/5 border border-black/50 rounded-md">
                        <FaBook size={24} className="mb-4" />
                        <h5 className="font-medium text-lg text-center">Laporan Magang Industri</h5>
                        <p className="text-xs text-secondary">
                          Tambahkan deskripsi untuk Laporan Hasil Magang Industri.
                        </p>
                      </a>
                    </Link>
                  ) : (
                    <div
                      className="relative w-fit col-span-12 md:col-span-6"
                      title="Sudah mengumpulkan"
                    >
                      <FaCheckCircle size={18} className="absolute top-2 right-2 text-green" />
                      <div className="h-40 p-2 md:p-4 flex flex-col items-center justify-center bg-green/10 border border-green rounded-md">
                        <FaBook size={24} className="mb-4" />
                        <h5 className="font-medium text-lg text-center">Laporan Magang Industri</h5>
                        <p className="text-xs text-secondary">
                          Tambahkan deskripsi untuk Laporan Hasil Magang Industri.
                        </p>
                      </div>
                    </div>
                  )}

                  <Link href="/mahasiswa/repositori/tambah/penelitian">
                    <a className="h-40 col-span-12 p-2 md:p-4 flex flex-col items-center justify-center hover:bg-black/5 border border-black/50 rounded-md">
                      <FaBook size={24} className="mb-4" />
                      <h5 className="font-medium text-lg text-center">
                        Laporan Penelitian Lainnya
                      </h5>
                      <p className="text-xs text-secondary">
                        Laporan Jurnal Penelitian, Laporan Jurnal Pengabdian masyarakat, dll.
                      </p>
                    </a>
                  </Link>
                </CardBody>

                <Divider />

                <CardFooter className="flex flex-col items-center justify-center gap-4 lg:gap-6 p-4">
                  <button
                    className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/80 hover:bg-red"
                    onClick={() => setIsOpenModal(false)}
                  >
                    Batal
                  </button>
                </CardFooter>
              </Dialog.Panel>
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
        destination: '/auth/masuk',
        permanent: false,
      },
    };
  }

  const payloads = jwtDecode(token);
  payloads.authenticated = true;

  if (payloads?.role === 'Administrator') {
    return {
      redirect: {
        destination: '/administrator/dashboard',
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
