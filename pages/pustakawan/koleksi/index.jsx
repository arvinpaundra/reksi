import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Footer from '../../../components/organisms/Footer';
import Link from 'next/link';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import { useCallback, useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Divider from '../../../components/atoms/Divider';
import { getAllCollections } from '../../../services/collection';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import Paginate from '../../../components/mollecules/Pagination';
import Drawer from 'react-modern-drawer';

const PustakawanKoleksi = ({ data }) => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const [query, setQuery] = useState('');
  const [visibility, setVisibility] = useState('Semua');
  const [visibilityFilter, setVisibilityFilter] = useState('Semua');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllCollectionsAPI = useCallback(async (keyword, visibility, limit, page) => {
    try {
      setLoading(true);
      const response = await getAllCollections(keyword, visibility, limit, page);

      setCollections(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllCollectionsAPI(keyword, visibility, limit, currPage);
  }, [getAllCollectionsAPI, keyword, visibility, limit, currPage]);

  const handleFilter = (event) => {
    event.preventDefault();

    setKeyword(query);
    setVisibility(visibilityFilter);
    setIsOpenDrawer(false);
  };

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer((prevState) => !prevState);
  };

  const handlerClearFilter = () => {
    setVisibilityFilter('Semua');

    setQuery('');
    setKeyword('');
    setVisibility('Semua');
  };

  return (
    <>
      <div>
        <Head>
          <title>Manajemen Koleksi</title>
        </Head>

        <div className="w-full min-h-screen">
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <SidebarStaff data={data} role="pustakawan" />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
                <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                  <h3 className="font-semibold text-base md:text-xl">Cari koleksi</h3>
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
                <CardBody>
                  <table className="w-full text-black/90 py-2">
                    <thead className="font-semibold text-center">
                      <tr className="border-b border-gray/30">
                        <td className="py-4">Nama</td>
                        <td className="py-4">Visibilitas</td>
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
                        collections?.map((collection) => (
                          <tr className="even:bg-blue/5 hover:bg-blue/5" key={collection.id}>
                            <td className="py-6">{collection.name}</td>
                            <td className="py-6">{collection.visibility}</td>
                            <td className="py-6">
                              <Link href={`/pustakawan/koleksi/${collection.id}/edit`}>
                                <a className="bg-blue/80 rounded-xl px-6 py-2 text-white font-medium hover:bg-blue">
                                  Edit
                                </a>
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </CardBody>

                <Divider />

                <CardFooter className="flex flex-col items-center justify-center p-6 gap-5">
                  {collections?.length > 0 && <Paginate pageChange={pageChange} pages={pages} />}

                  <Link href="/pustakawan/koleksi/tambah">
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
            <label htmlFor="visibility" className="text-black/90">
              Visibilitas
            </label>
            <Listbox value={visibilityFilter} onChange={(value) => setVisibilityFilter(value)}>
              <div className="relative">
                <Listbox.Button
                  className={`relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue`}
                >
                  <span className="block truncate text-start">{visibilityFilter}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 z-50 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
                    value="Dosen"
                  >
                    Dosen
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Mahasiswa"
                  >
                    Mahasiswa
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
            onClick={handleFilter}
          >
            Cari
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default PustakawanKoleksi;

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
