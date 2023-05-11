import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../components/organisms/Navbar';
import Sidebar from '../../components/organisms/Sidebar';
import Footer from '../../components/organisms/Footer';
import CardProfilDosen from '../../components/organisms/CardProfilDosen';

const ProfilDosen = (props) => {
  const { data } = props;

  return (
    <div>
      <Head>
        <title>Profil Dosen</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" role="dosen" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <Sidebar data={data} role="dosen" />

          <CardProfilDosen data={data} />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default ProfilDosen;

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
  } else if (payloads?.role === 'Mahasiswa') {
    return {
      redirect: {
        destination: '/mahasiswa/profil',
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
