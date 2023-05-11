import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../components/organisms/Navbar';
import Card from '../../components/atoms/Card';
import CardHeader from '../../components/atoms/Card/CardHeader';
import Divider from '../../components/atoms/Divider';
import CardBody from '../../components/atoms/Card/CardBody';
import { Input } from '../../components/atoms/Input';
import ImportantField from '../../components/atoms/Important';
import CardFooter from '../../components/atoms/Card/CardFooter';
import { ButtonFilled } from '../../components/atoms/Button';
import { useState } from 'react';
import { setForgotPassword, setSendEmailForgotPassword } from '../../services/auth';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hide, setHide] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);

  const router = useRouter();
  const { token } = router.query;

  if (token) {
    const handleResetPassword = async (event) => {
      event.preventDefault();

      const data = {
        password: password.trim(),
        token: token,
      };

      try {
        setLoading(true);

        const response = await setForgotPassword(data);

        if (response?.code === 400) {
          setErrors(response?.errors);

          if (response?.errors?.password) {
            toast.warning('Silahkan masukan kata sandi.', { toastId: 'error-password' });
            return;
          }

          if (response?.errors?.link) {
            setErrors({});
            toast.error('Link telah kadaluarsa.', { toastId: 'error-link' });
            return;
          }

          if (response?.errors?.token) {
            setErrors({});
            toast.error('Kode token salah.', { toastId: 'error-token' });
            return;
          }
        }

        if (response?.code === 404) {
          setErrors({});
          toast.error('Akun tidak ditemukan.', { toastId: 'error-404' });
          return;
        }

        if (response?.code === 500) {
          setErrors({});
          toast.error(response?.message, { toastId: 'error-505' });
          return;
        }

        toast.success('Kata sandi berhasil diubah!', { toastId: 'success' });
        router.push('/auth/masuk');
        setErrors({});
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <Head>
          <title>Lupa Kata Sandi</title>
        </Head>

        <div className="w-full min-h-screen flex flex-col justify-between">
          <div>
            <Navbar active="" />

            <div className="flex items-center justify-center px-4 md:px-12 lg:px-40 2xl:px-96 mt-6 mb-20 lg:my-6">
              <Card className="w-full bg-white rounded-lg overflow-hidden py-4 lg:py-8">
                <CardHeader>
                  <h2 className="text-center font-semibold text-2xl lg:text-4xl mb-4 md:mb-8">
                    Masukan Kata Sandi Baru
                  </h2>
                </CardHeader>

                <Divider />

                <CardBody className="w-full bg-white p-4 md:px-12 lg:px-32 lg:py-8">
                  <form className="flex flex-col gap-4">
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
                  </form>
                </CardBody>

                <Divider />

                <CardFooter className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6 mt-4 md:mt-8">
                  {loading && (
                    <ButtonFilled bgcolor="bg-blue/60 cursor-no-drop">Memuat . . .</ButtonFilled>
                  )}

                  {!loading && (
                    <ButtonFilled bgcolor="bg-blue/80 hover:bg-blue" onClick={handleResetPassword}>
                      Kirim
                    </ButtonFilled>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSendToEmail = async (event) => {
    event.preventDefault();

    const data = {
      email: email.trim(),
    };

    try {
      setLoading(true);

      const response = await setSendEmailForgotPassword(data);

      if (response?.code === 400) {
        setErrors(response?.errors);

        if (response?.errors?.link) {
          setErrors({});
          toast.warning('Link telah terkirim.', { toastId: 'warning' });
          return;
        }

        if (response?.errors?.email) {
          toast.warning('Silahkan masukan email Anda.', { toastId: 'warning' });
          return;
        }
      }

      if (response?.code === 404) {
        setErrors({});
        toast.error('Akun tidak ditemukan.', { toastId: 'error' });
        return;
      }

      toast.success('Link reset kata sandi berhasil terkirim ke email Anda!');
      setErrors({});
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Lupa Kata Sandi</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="" />

          <div className="flex items-center justify-center px-4 md:px-12 lg:px-40 2xl:px-96 mt-6 mb-20 lg:my-6">
            <Card className="w-full bg-white rounded-lg overflow-hidden py-4 lg:py-8">
              <CardHeader>
                <h2 className="text-center font-semibold text-2xl lg:text-4xl mb-4 md:mb-8">
                  Atur Ulang Kata Sandi
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
                      placeholder="Masukan email"
                      onChange={(event) => setEmail(event.target.value)}
                      error={errors?.email}
                    />
                    {errors && <p className="text-red text-sm">{errors?.email}</p>}
                  </div>
                </form>
              </CardBody>

              <Divider />

              <CardFooter className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6 mt-4 md:mt-8">
                {loading && (
                  <ButtonFilled bgcolor="bg-blue/60 cursor-no-drop">Memuat . . .</ButtonFilled>
                )}

                {!loading && (
                  <ButtonFilled bgcolor="bg-blue/80 hover:bg-blue" onClick={handleSendToEmail}>
                    Kirim
                  </ButtonFilled>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

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
