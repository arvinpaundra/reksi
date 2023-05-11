import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import CardFinalProject from '../../../../components/organisms/CardFinalProject';
import Footer from '../../../../components/organisms/Footer';
import Navbar from '../../../../components/organisms/Navbar';
import Sidebar from '../../../../components/organisms/Sidebar';

const FinalProjectReport = (props) => {
  const { data } = props;

  return (
    <div>
      <Head>
        <title>Unggah Laporan Tugas Akhir</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <Sidebar data={data} />

          <CardFinalProject user={data} />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default FinalProjectReport;

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
