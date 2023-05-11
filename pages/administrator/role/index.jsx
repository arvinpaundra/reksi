import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../components/organisms/Navbar';
import SidebarStaff from '../../../components/organisms/Sidebar/SidebarStaff';
import Footer from '../../../components/organisms/Footer';
import Divider from '../../../components/atoms/Divider';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import CardBody from '../../../components/atoms/Card/CardBody';
import Card from '../../../components/atoms/Card';
import { MdOutlineAddCircleOutline } from 'react-icons/md';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getAllRoles } from '../../../services/role';

const AdministratorRole = ({ data }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(null);

  const getAllRolesAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllRoles('');

      setRoles(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllRolesAPI();
  }, [getAllRolesAPI]);

  return (
    <div>
      <Head>
        <title>Manajemen Role</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl">Role atau Hak Akses</h2>
            </CardHeader>

            <CardBody className="py-2 flex flex-col gap-4">
              <table className="table-auto w-full text-black/90">
                <thead className="font-semibold text-center">
                  <tr className="border-b border-gray/30">
                    <td className="py-4">No.</td>
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
                    roles?.map((role, index) => (
                      <tr className="even:bg-blue/5 hover:bg-blue/5" key={role.id}>
                        <td className="py-6">{index + 1}</td>
                        <td className="py-6">{role.role}</td>
                        <td className="py-6">{role.visibility}</td>
                        <td className="py-6">
                          <Link href={`/administrator/role/${role.id}/edit`}>
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

            <CardFooter className="flex items-center justify-center p-6 gap-4">
              <Link href="/administrator/role/tambah">
                <a className="py-2 px-6 text-white font-medium flex items-center justify-center gap-2 rounded-xl bg-green/80 hover:bg-green">
                  <MdOutlineAddCircleOutline className="text-white" />
                  Tambah
                </a>
              </Link>
            </CardFooter>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdministratorRole;

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
