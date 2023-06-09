import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Footer from '../../../components/organisms/Footer';
import Link from 'next/link';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import { useCallback, useEffect, useState } from 'react';
import Divider from '../../../components/atoms/Divider';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import Paginate from '../../../components/mollecules/Pagination';
import { getCategories } from '../../../services/category';

const PustakawanCategory = ({ data }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null);

  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllCategoriesAPI = useCallback(async (keyword, limit, page) => {
    try {
      setLoading(true);
      const response = await getCategories(keyword, limit, page);

      setCategories(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllCategoriesAPI(keyword, limit, currPage);
  }, [getAllCategoriesAPI, keyword, limit, currPage]);

  const handleFilter = (event) => {
    event.preventDefault();

    setKeyword(query);
  };

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  return (
    <div>
      <Head>
        <title>Manajemen Kategori</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="pustakawan" />

          <div className="flex flex-col gap-4 xl:col-span-9">
            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
              <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                <h3 className="font-semibold text-base md:text-xl">Cari kategori</h3>
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
              <CardBody>
                <table className="w-full text-black/90 py-2">
                  <thead className="font-semibold text-center">
                    <tr className="border-b border-gray/30">
                      <td className="py-4">Nama</td>
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
                      categories?.map((category) => (
                        <tr className="even:bg-blue/5 hover:bg-blue/5" key={category.id}>
                          <td className="py-6">{category.name}</td>
                          <td className="py-6">
                            <Link href={`/pustakawan/kategori/${category.id}/edit`}>
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
                {categories?.length > 0 && <Paginate pageChange={pageChange} pages={pages} />}

                <Link href="/pustakawan/kategori/tambah">
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
  );
};

export default PustakawanCategory;

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
