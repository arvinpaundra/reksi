/* eslint-disable @next/next/no-img-element */
import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Badge from '../../../components/atoms/Badge';
import Card from '../../../components/atoms/Card';
import CardBody from '../../../components/atoms/Card/CardBody';
import CardHeader from '../../../components/atoms/Card/CardHeader';
import Divider from '../../../components/atoms/Divider';
import Footer from '../../../components/organisms/Footer';
import Navbar from '../../../components/organisms/Navbar';
import Sidebar from '../../../components/organisms/Sidebar';
import { getDetailRepository } from '../../../services/repository';
import TextInfo from '../../../components/mollecules/TextInfo';
import { FormatDateIntl } from '../../../helper/format_date_intl';

const PemustakaRepositoriDetail = (props) => {
  const { data } = props;

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

  const router = useRouter();

  const { id } = router.query;

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
    getDetailRepositoryAPI(id);
  }, [getDetailRepositoryAPI, id]);

  const title = repository?.title;
  const formatUpdateDesc = repository?.update_desc?.replace(/\r\n/g, '<br/>');

  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-6">
            <Sidebar data={data} />

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
                        <h3 className="font-semibold text-lg mb-2 md:mb-4">Hasil Pengembangan</h3>
                        <div className="flex flex-col gap-2">
                          <TextInfo label="Judul Terkait" value={repository?.related_title} />
                          <div>
                            <p className="text-sm text-secondary mb-0.5">Deksripsi pengembangan</p>
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
                </CardBody>
              )}
            </Card>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default PemustakaRepositoriDetail;

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
