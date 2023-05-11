import Head from 'next/head';
import CardRegister from '../../components/organisms/CardRegister';
import Footer from '../../components/organisms/Footer';
import Navbar from '../../components/organisms/Navbar';

const Register = () => {
  return (
    <div>
      <Head>
        <title>Register</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="flex items-center justify-center px-4 md:px-12 lg:px-40 2xl:px-96 mt-6 mb-20 lg:my-6">
            <CardRegister />
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Register;

export function getServerSideProps({ req }) {
  const { token } = req.cookies;

  if (token) {
    const payloads = jwtDecode(token);

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
  }

  return {
    props: {},
  };
}
