import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import Link from 'next/link';
import Divider from '../../../components/atoms/Divider';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import Footer from '../../../components/organisms/Footer';
import { useCallback, useEffect, useState } from 'react';
import Paginate from '../../../components/mollecules/Pagination';
import { getAllStudyPrograms } from '../../../services/study_program';

const AdminsitratorProgramStudi = ({ data }) => {
  const [prodi, setProdi] = useState([]);
  const [loading, setLoading] = useState(null);

  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);

  const getAllStudyProgramsAPI = useCallback(async (keyword, limit, page) => {
    try {
      setLoading(true);
      const response = await getAllStudyPrograms(keyword, limit, page);

      setProdi(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllStudyProgramsAPI(keyword, limit, currPage);
  }, [getAllStudyProgramsAPI, keyword, limit, currPage]);

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
        <title>Manajemen Program Studi</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <div className="flex flex-col gap-4 xl:col-span-9">
            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit">
              <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                <h3 className="font-semibold text-base md:text-xl">Cari program studi</h3>
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
                <table className="w-full text-black/90 py-2 table-auto">
                  <thead className="font-semibold text-center">
                    <tr className="border-b border-gray/30">
                      <td className="py-4 px-2">Nama</td>
                      <td className="py-4 px-2">Jurusan</td>
                      <td className="py-4 px-2">Warna Cover</td>
                      <td className="py-4 px-2">Aksi</td>
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
                      prodi?.map((item) => (
                        <tr className="even:bg-blue/5 hover:bg-blue/5" key={item.id}>
                          <td className="py-6 px-4">{item.name}</td>
                          <td className="py-6 px-4">{item.departement}</td>
                          <td className="py-6 px-4">{item.cover_color}</td>
                          <td className="py-6 px-4">
                            <Link href={`/administrator/program-studi/${item.id}/edit`}>
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
                {prodi?.length > 0 && <Paginate pageChange={pageChange} pages={pages} />}

                <Link href="/administrator/program-studi/tambah">
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

export default AdminsitratorProgramStudi;

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
