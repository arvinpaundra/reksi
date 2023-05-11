import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { ButtonFilled } from '../../../components/atoms/Button';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardFooter from '../../../components/atoms/Card/CardFooter';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Divider from '../../../components/atoms/Divider';
import ImportantField from '../../../components/atoms/Important';
import { Input } from '../../../components/atoms/Input';
import Footer from '../../../components/organisms/Footer';
import Navbar from '../../../components/organisms/Navbar';
import Sidebar from '../../../components/organisms/Sidebar';
import { setChangePassword } from '../../../services/auth';
import { useRouter } from 'next/router';
import { getDetailPemustaka } from '../../../services/pemustaka';
import { toast } from 'react-toastify';

const GantiSandiMahasiswa = ({ data }) => {
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    id: '',
    user_id: '',
  });
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const router = useRouter();

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(pemustaka_id);

      setUser(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: pemustaka_id } = data;

  useEffect(() => {
    getDetailPemustakaAPI(pemustaka_id);
  }, [getDetailPemustakaAPI, pemustaka_id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      password: password.trim(),
      repeated_password: repeatedPassword.trim(),
    };

    try {
      setLoading(true);

      const response = await setChangePassword(user?.user_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        setErrors({});
        return;
      }

      toast.success('Yeay! Sukses ganti kata sandi.');
      router.push('/dosen/profil');
      setErrors({});
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Ganti Kata Sandi</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <Sidebar data={data} />

            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
              <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
                <h2 className="text-white text-lg md:text-xl">Ganti Kata Sandi</h2>
              </CardHeader>

              <CardBody>
                <div className="p-4 md:p-6 md:flex md:gap-4 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password1">
                      Kata sandi baru <ImportantField />
                    </label>
                    <div className="h-fit relative">
                      <Input
                        id="password"
                        type={hide1 ? 'password' : 'text'}
                        placeholder="Kata sandi"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        error={errors?.password}
                      />
                      <div
                        className="absolute right-4 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10"
                        onClick={() => setHide1((prev) => !prev)}
                      >
                        {hide1 ? (
                          <VscEye size={20} title="Show" />
                        ) : (
                          <VscEyeClosed size={20} title="Hide" />
                        )}
                      </div>
                    </div>
                    {errors && <p className="text-red text-sm">{errors?.password}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="password1">
                      Ketik ulang kata sandi baru <ImportantField />
                    </label>
                    <div className="h-fit relative">
                      <Input
                        id="repeated_password"
                        type={hide2 ? 'password' : 'text'}
                        placeholder="Kata sandi"
                        value={repeatedPassword}
                        onChange={(event) => setRepeatedPassword(event.target.value)}
                        error={errors?.repeated_password}
                      />
                      <div
                        className="absolute right-4 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10"
                        onClick={() => setHide2((prev) => !prev)}
                      >
                        {hide2 ? (
                          <VscEye size={20} title="Show" />
                        ) : (
                          <VscEyeClosed size={20} title="Hide" />
                        )}
                      </div>
                    </div>
                    {errors && <p className="text-red text-sm">{errors?.repeated_password}</p>}
                  </div>
                </div>
              </CardBody>

              <Divider />

              <CardFooter className="flex items-center justify-center p-6">
                {loading && (
                  <button
                    className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-blue/60 disabled:cursor-no-drop`}
                    disabled
                  >
                    Memuat . . .
                  </button>
                )}

                {!loading && (
                  <ButtonFilled bgcolor="bg-blue/80 hover:bg-blue" onClick={handleSubmit}>
                    Simpan
                  </ButtonFilled>
                )}
              </CardFooter>
            </Card>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default GantiSandiMahasiswa;

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
