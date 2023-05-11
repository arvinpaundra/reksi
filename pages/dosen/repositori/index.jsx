import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Footer from '../../../components/organisms/Footer';
import Navbar from '../../../components/organisms/Navbar';
import Sidebar from '../../../components/organisms/Sidebar';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Link from 'next/link';

const RepositoryCategory = (props) => {
  const { data } = props;

  return (
    <div>
      <Head>
        <title>Pilih Kategori Karya Tulis Ilmiah</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar role="dosen" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <Sidebar data={data} role="dosen" />

            <div className="flex flex-col gap-4 xl:col-span-9">
              <Card className="w-full  rounded-lg overflow-hidden h-full">
                <CardHeader className="p-4 md:p-8 md:px-6 lg:px-10 flex flex-col gap-3 bg-white">
                  <h3 className="text-center font-semibold text-base md:text-xl">
                    Pilih berdasarkan kategori
                  </h3>
                </CardHeader>

                <CardBody className="grid grid-cols-12 gap-4 w-full py-4">
                  <div className="col-span-4 rounded-lg bg-white border border-transparent hover:border hover:border-blue hover:bg-blue/5">
                    <Link href="/dosen/repositori/dibuat">
                      <a>
                        <div className="p-6">
                          <h3>
                            Karya tulis ilmiah yang telah{' '}
                            <span className="font-semibold">dibuat</span>.
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="col-span-4 rounded-lg bg-white border border-transparent hover:border hover:border-blue hover:bg-blue/5">
                    <Link href="/dosen/repositori/dibimbing">
                      <a>
                        <div className="p-6">
                          <h3>
                            Karya tulis ilmiah yang telah{' '}
                            <span className="font-semibold">dibimbing</span>.
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                  <div className="col-span-4 rounded-lg bg-white border border-transparent hover:border hover:border-blue hover:bg-blue/5">
                    <Link href="/dosen/repositori/diuji">
                      <a>
                        <div className="p-6">
                          <h3>
                            Karya tulis ilmiah yang telah{' '}
                            <span className="font-semibold">diuji</span>.
                          </h3>
                        </div>
                      </a>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default RepositoryCategory;

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
