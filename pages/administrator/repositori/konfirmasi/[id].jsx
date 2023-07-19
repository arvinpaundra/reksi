/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CardFooter from '../../../../components/atoms/Card/CardFooter';
import { confirmRepository, getDetailRepository } from '../../../../services/repository';
import SidebarStaff from '../../../../components/organisms/Sidebar/SidebarStaff';
import Navbar from '../../../../components/organisms/Navbar';
import Card from '../../../../components/atoms/Card';
import CardHeader from '../../../../components/atoms/Card/CardHeader';
import CardBody from '../../../../components/atoms/Card/CardBody';
import Badge from '../../../../components/atoms/Badge';
import Divider from '../../../../components/atoms/Divider';
import TextInfo from '../../../../components/mollecules/TextInfo';
import Footer from '../../../../components/organisms/Footer';
import { toast } from 'react-toastify';
import { FormatDateIntl } from '../../../../helper/format_date_intl';
import { Dialog, Transition } from '@headlessui/react';
import ImportantField from '../../../../components/atoms/Important';
import { Fragment } from 'react';

const AdministratorKonfirmasiDetailRepository = ({ data }) => {
  const [repository, setRepository] = useState({
    id: '',
    title: '',
    abstract: '',
    improvement: '',
    related_title: '',
    update_desc: '',
    date_validated: '',
    status: '',
    collection: '',
    departement: '',
    authors: [],
    contributors: [],
    documents: {},
    created_at: '',
    updated_at: '',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [reasons, setReasons] = useState('');

  const router = useRouter();

  const { id: repository_id } = router.query;

  const getDetailRepositoryAPI = useCallback(async (repository_id) => {
    try {
      setLoading(true);

      const response = await getDetailRepository(repository_id);

      setRepository(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getDetailRepositoryAPI(repository_id);
  }, [getDetailRepositoryAPI, repository_id]);

  const title = repository?.title;
  const formatUpdateDesc = repository?.update_desc?.replace(/\r\n/g, '<br/>');

  const handleAccept = async () => {
    const data = {
      status: 'approved',
    };

    try {
      setLoading(true);
      const response = await confirmRepository(repository_id, data);

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Berhasil terima karya tulis ilmiah.');
      router.push('/administrator/repositori/konfirmasi');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDenied = async () => {
    setErrors(null);
    const data = {
      status: 'denied',
      reasons: reasons,
    };

    try {
      setLoading(true);
      const response = await confirmRepository(repository_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap!', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Berhasil tolak karya tulis ilmiah.');
      router.push('/administrator/repositori/konfirmasi');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
        </Head>

        <div className="w-full min-h-screen flex flex-col justify-between">
          <div>
            <Navbar active="mahasiswa" />

            <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
              <SidebarStaff data={data} role="administrator" />

              <div className="flex flex-col gap-4 xl:col-span-9">
                <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
                  <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
                    <h2 className="text-white text-lg md:text-xl">Detail Karya Tulis Ilimiah</h2>
                  </CardHeader>

                  {loading ? (
                    <CardBody>
                      <div className="w-full font-semibold text-center p-8">
                        <p>Loading . . .</p>
                      </div>
                    </CardBody>
                  ) : (
                    <CardBody>
                      <div className="p-4 md:p-6 md:flex md:gap-4">
                        <img src="/images/pdf.png" alt="" className="hidden lg:block w-32 h-32" />
                        <div>
                          <h2 className="text-base font-semibold text-justify mb-2">
                            {repository?.title}
                          </h2>
                          <p className="text-sm text-secondary my-1">
                            Disahkan {FormatDateIntl(repository.date_validated)}
                          </p>
                          {repository?.authors?.map((author) => (
                            <p className="text-sm text-secondary" key={author.author_id}>
                              {author.fullname}
                            </p>
                          ))}
                          <div className="flex items-center justify-start flex-wrap gap-2 mt-2">
                            <Badge borderColor="border-green" textColor="text-green">
                              {repository?.collection}
                            </Badge>
                            <Badge borderColor="border-red" textColor="text-red">
                              {repository?.category}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {repository?.abstract && (
                        <>
                          <Divider />
                          <div className="p-4 md:p-6">
                            <h3 className="font-bold italic text-lg text-center mb-2 md:mb-4">
                              Abstrak
                            </h3>
                            <p className="italic text-sm text-secondary text-justify">
                              {repository?.abstract}
                            </p>
                          </div>
                        </>
                      )}

                      <Divider />

                      <div className="p-4 md:p-6">
                        <h3 className="font-semibold text-lg mb-2 md:mb-4">Detail Informasi</h3>
                        <div className="lg:grid lg:grid-cols-12 lg:gap-4">
                          <div className="flex flex-col gap-2 lg:col-span-6 mb-2 lg:mb-0">
                            <div>
                              <p className="text-sm text-secondary mb-0.5">Penulis</p>
                              {repository?.authors?.map((author) => (
                                <p key={author?.author_id}>{author?.fullname}</p>
                              ))}
                            </div>
                            <TextInfo label="Koleksi" value={repository?.collection} />
                            <TextInfo label="Kategori" value={repository?.category} />
                            <TextInfo label="Jurusan" value={repository?.departement} />
                            <TextInfo
                              label="Tanggal Disahkan"
                              value={FormatDateIntl(repository.date_validated)}
                            />
                            <TextInfo
                              label="Tanggal Unggah"
                              value={new Date(repository.created_at).toLocaleDateString('in-IN', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric',
                              })}
                            />
                          </div>
                          {repository?.contributors?.length && (
                            <div className="flex flex-col gap-2 lg:col-span-6">
                              <div>
                                <p className="text-sm text-secondary">Pembimbing</p>
                                {repository?.contributors
                                  ?.filter((contributor) =>
                                    contributor?.contributed_as?.includes('Pembimbing'),
                                  )
                                  .map((contributor) => (
                                    <p key={contributor?.contributor_id}>{contributor?.fullname}</p>
                                  ))}
                              </div>
                              <div>
                                <p className="text-sm text-secondary">Penguji</p>
                                {repository?.contributors
                                  ?.filter((contributor) =>
                                    contributor?.contributed_as?.includes('Penguji'),
                                  )
                                  .map((contributor) => (
                                    <p key={contributor?.contributor_id}>{contributor?.fullname}</p>
                                  ))}
                                {repository?.contributors?.filter((contributor) =>
                                  contributor?.contributed_as?.includes('Penguji'),
                                ).length === 0 && <p>-</p>}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {repository?.update_desc && (
                        <>
                          <Divider />

                          <div className="p-4 md:p-6">
                            <h3 className="font-semibold text-lg mb-2 md:mb-4">
                              Hasil Pengembangan
                            </h3>
                            <div className="flex flex-col gap-2">
                              <TextInfo label="Judul Terkait" value={repository?.related_title} />
                              <div>
                                <p className="text-sm text-secondary mb-0.5">
                                  Deksripsi pengembangan
                                </p>
                                <div dangerouslySetInnerHTML={{ __html: formatUpdateDesc }} />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <Divider />

                      <div className="p-4 md:p-6">
                        <h3 className="font-semibold text-lg mb-2 md:mb-4">Dokumen</h3>
                        <div className="flex flex-col gap-2">
                          <TextInfo
                            label="Halaman Pengesahan"
                            value="halaman_pengesahan.pdf"
                            href={repository?.documents?.validity_page}
                          />
                          <TextInfo
                            label="Cover dan Daftar Isi"
                            value="cover_dan_daftar_isi.pdf"
                            href={repository?.documents?.cover_and_list_content}
                          />
                          <TextInfo
                            label="BAB I"
                            value="bab1.pdf"
                            href={repository?.documents?.chp_one}
                          />
                          <TextInfo
                            label="BAB II"
                            value="bab2.pdf"
                            href={repository?.documents?.chp_two}
                          />
                          <TextInfo
                            label="BAB III"
                            value="bab3.pdf"
                            href={repository?.documents?.chp_three}
                          />
                          <TextInfo
                            label="BAB IV"
                            value="bab4.pdf"
                            href={repository?.documents?.chp_four}
                          />
                          <TextInfo
                            label="BAB V"
                            value="bab5.pdf"
                            href={repository?.documents?.chp_five}
                          />
                          <TextInfo
                            label="Daftar Pustaka"
                            value="daftar_pustaka.pdf"
                            href={repository?.documents?.bibliography}
                          />
                        </div>
                      </div>

                      <Divider />
                      {repository.status === 'pending' && (
                        <CardFooter className="flex flex-col items-center justify-center gap-2 lg:gap-6 p-4">
                          <p className="font-medium">Konfirmasi karya tulis ilmiah ?</p>

                          {loading && (
                            <div className="flex items-center justify-center gap-4 lg:gap-6">
                              <button
                                className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/60 disabled:cursor-no-drop"
                                disabled
                              >
                                Tolak
                              </button>

                              <button
                                className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop"
                                disabled
                              >
                                Terima
                              </button>
                            </div>
                          )}

                          {!loading && (
                            <div className="flex items-center justify-center gap-4 lg:gap-6">
                              <button
                                className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/80 hover:bg-red"
                                onClick={() => setOpenModal(true)}
                              >
                                Tolak
                              </button>

                              <button
                                className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/80 hover:bg-green"
                                onClick={handleAccept}
                              >
                                Terima
                              </button>
                            </div>
                          )}
                        </CardFooter>
                      )}
                    </CardBody>
                  )}
                </Card>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>

      {/* Modal Denied Repository */}
      <Transition show={openModal} as={Fragment}>
        <Dialog
          className="relative z-10"
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setErrors(null);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex items-center justify-center min-h-screen p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 overflow-y-auto py-8">
                  <div className="flex min-h-full items-center justify-center">
                    <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white shadow-xl transition-all">
                      <CardHeader className="p-4 2xl:p-8">
                        <h2 className="text-center font-semibold text-base md:text-lg lg:text-xl">
                          Alasan Penolakan Karya Tulis Ilmiah
                        </h2>
                      </CardHeader>

                      <Divider />

                      <CardBody className="p-4 flex flex-col gap-4 w-full">
                        <div className="flex flex-col gap-1">
                          <label htmlFor="reasons">
                            Alasan
                            <ImportantField />
                          </label>
                          <textarea
                            className={`relative w-full border ${
                              errors?.reasons ? 'border-red' : 'border-black/50'
                            } rounded-xl py-2 px-4 outline-none focus:border-blue`}
                            placeholder="Deskripsikan alasan penolakan"
                            rows={5}
                            value={reasons}
                            onChange={(event) => setReasons(event.target.value)}
                          />
                          {errors && <p className="text-red text-sm">{errors?.reasons}</p>}
                        </div>
                      </CardBody>

                      <Divider />

                      <CardFooter className="flex items-center justify-center gap-4 lg:gap-6 p-4">
                        {loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Batal
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop"
                              disabled
                            >
                              Simpan
                            </button>
                          </>
                        )}

                        {!loading && (
                          <>
                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-red/80 hover:bg-red"
                              onClick={() => {
                                setOpenModal(false);
                                setErrors(null);
                                setReasons('');
                              }}
                            >
                              Batal
                            </button>

                            <button
                              className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/80 hover:bg-green"
                              onClick={handleDenied}
                            >
                              Simpan
                            </button>
                          </>
                        )}
                      </CardFooter>
                    </Dialog.Panel>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AdministratorKonfirmasiDetailRepository;

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
