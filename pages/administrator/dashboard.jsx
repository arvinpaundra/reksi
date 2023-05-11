import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import SidebarStaff from '../../components/organisms/Sidebar/SidebarStaff';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getDashboardOverview } from '../../services/dashboard';
import { NumericFormat } from 'react-number-format';

const AdministratorDashboard = ({ data }) => {
  const [items, setItems] = useState([
    {
      label: 'Total pemustaka',
      value: 0,
      link: '/administrator/pemustaka',
    },
    {
      label: 'Total repositori',
      value: 0,
      link: '/administrator/repositori',
    },
    {
      label: 'Total permintaan akses pending',
      value: 0,
      link: '/administrator/permintaan-akses',
    },
  ]);
  const [loading, setLoading] = useState(null);

  const getDashboardOverviewAPI = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getDashboardOverview();

      setItems([
        {
          label: 'Total pemustaka',
          value: response?.data?.total_pemustaka,
          link: '/administrator/pemustaka',
        },
        {
          label: 'Total repositori',
          value: response?.data?.total_repository,
          link: '/administrator/repositori',
        },
        {
          label: 'Total permintaan akses pending',
          value: response?.data?.total_request_access_pending,
          link: '/administrator/permintaan-akses',
        },
      ]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDashboardOverviewAPI();
  }, [getDashboardOverviewAPI]);

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <div className="xl:col-span-9 p-4 md:p-0 grid grid-cols-12 grid-rows-2 gap-4 h-fit">
            {items?.map((item, index) => (
              <div
                key={index}
                className="col-span-4 rounded-lg bg-white border border-transparent hover:border hover:border-blue hover:bg-blue/5"
              >
                <Link href={item.link}>
                  <a>
                    <div className="p-6 flex flex-col justify-between gap-4 w-full h-full">
                      <h3>{item.label}</h3>
                      <h2 className="text-5xl font-semibold">
                        <NumericFormat
                          type="text"
                          displayType="text"
                          thousandSeparator="."
                          decimalSeparator=","
                          value={item.value}
                        />
                      </h2>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdministratorDashboard;

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
