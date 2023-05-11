import jwtDecode from 'jwt-decode';
import Link from 'next/link';
import { BiChevronRight } from 'react-icons/bi';
import Footer from '../../../components/organisms/Footer';
import { ButtonFilled } from '../../../components/atoms/Button';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import Divider from '../../../components/atoms/Divider';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { Input } from '../../../components/atoms/Input';
import ImportantField from '../../../components/atoms/Important';
import CardBody from '../../../components/atoms/Card/CardBody';
import Navbar from '../../../components/organisms/Navbar';
import Card from '../../../components/atoms/Card';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Head from 'next/head';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { setLoginStaff } from '../../../services/auth';

const StaffLogin = (props) => {
  const [hide, setHide] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);

  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrors({});

    const data = {
      email: email,
      password: password,
    };

    try {
      setLoading(true);
      const response = await setLoginStaff(data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      // SUCCESS
      toast.success('Yeay, login berhasil!', { toastId: 'login-success' });
      const token = response.data?.token;
      Cookies.set('token', token);

      const payloads = jwtDecode(token);

      if (payloads?.role === 'Kepala Perpustakaan') {
        router.push('/kepala-perpustakaan/dashboard');
      } else if (payloads?.role === 'Administrator') {
        router.push('/administrator/dashboard');
      } else if (payloads?.role === 'Pustakawan') {
        router.push('/pustakawan/dashboard');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Masuk</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="flex items-center justify-center px-4 md:px-12 lg:px-40 2xl:px-96 mt-6 mb-20 lg:my-6">
            <Card className="w-full bg-white rounded-lg overflow-hidden py-4 lg:py-8">
              <CardHeader>
                <h2 className="text-center font-semibold text-2xl lg:text-4xl mb-4 md:mb-8">
                  Masuk Petugas
                </h2>
              </CardHeader>

              <Divider />

              <CardBody className="w-full bg-white p-4 md:px-12 lg:px-32 lg:py-8">
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email">
                      Email <ImportantField />
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Alamat email"
                      onChange={(event) => setEmail(event.target.value)}
                      error={errors?.email}
                    />
                    {errors && <p className="text-red text-sm">{errors?.email}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password">
                      Kata Sandi <ImportantField />
                    </label>
                    <div className="h-fit relative">
                      <Input
                        id="password"
                        type={hide ? 'password' : 'text'}
                        placeholder="Kata sandi"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        error={errors?.password}
                      />
                      <div
                        className="absolute right-4 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10"
                        onClick={() => setHide((prev) => !prev)}
                      >
                        {hide ? (
                          <VscEye size={20} title="Show" />
                        ) : (
                          <VscEyeClosed size={20} title="Hide" />
                        )}
                      </div>
                    </div>
                    {errors && <p className="text-red text-sm">{errors?.password}</p>}
                  </div>

                  <div className="self-end">
                    <Link href="/auth/forgot-password">
                      <a>Lupa kata sandi ?</a>
                    </Link>
                  </div>
                </form>
              </CardBody>

              <Divider />

              <CardFooter className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6 mt-4 md:mt-8">
                {loading && (
                  <ButtonFilled bgcolor="bg-blue/60 cursor-no-drop">Memuat . . .</ButtonFilled>
                )}

                {!loading && (
                  <ButtonFilled bgcolor="bg-blue/80 hover:bg-blue" onClick={handleLogin}>
                    Masuk
                  </ButtonFilled>
                )}

                <Link href="/auth/masuk">
                  <a className="inline-flex gap-1">
                    Masuk sebagai
                    <span className="text-blue/90 font-semibold flex items-center gap-1">
                      Pemustaka <BiChevronRight />
                    </span>
                  </a>
                </Link>
              </CardFooter>
            </Card>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default StaffLogin;

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
