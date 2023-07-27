import Head from 'next/head';
import Navbar from '../../../../../components/organisms/Navbar';
import Footer from '../../../../../components/organisms/Footer';
import jwtDecode from 'jwt-decode';
import { useState } from 'react';
import { ButtonFilled } from '../../../../../components/atoms/Button';
import CardFooter from '../../../../../components/atoms/Card/CardFooter';
import Divider from '../../../../../components/atoms/Divider';
import { Input, InputFile } from '../../../../../components/atoms/Input';
import ImportantField from '../../../../../components/atoms/Important';
import SelectLecture from '../../../../../components/mollecules/Select/Lecture';
import SelectDepartement from '../../../../../components/mollecules/Select/Departement';
import SelectCategory from '../../../../../components/mollecules/Select/Category';
import CardHeader from '../../../../../components/atoms/Card/CardHeader';
import CardBody from '../../../../../components/atoms/Card/CardBody';
import Card from '../../../../../components/atoms/Card';
import { useCallback } from 'react';
import { getDetailRepository, setUpdateInternshipReport } from '../../../../../services/repository';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import SidebarStaff from '../../../../../components/organisms/Sidebar/SidebarStaff';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';

const EditInternshipReportAdministrator = ({ data }) => {
  const [repository, setRepository] = useState({
    id: '',
    category_id: '',
    departement_id: '',
    title: '',
    abstract: '',
    improvement: '',
    related_title: '',
    update_desc: '',
    date_validated: '',
    status: '',
    collection: '',
    category: '',
    departement: '',
    authors: [],
    contributors: [],
    documents: {},
    created_at: '',
    updated_at: '',
  });
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState(null);

  const [fileValidityPage, setFileValidityPage] = useState(null);
  const [fileCoverAndListContent, setCoverAndListContent] = useState(null);
  const [fileBab1, setFileBab1] = useState(null);
  const [fileBab2, setFileBab2] = useState(null);
  const [fileBab3, setFileBab3] = useState(null);
  const [fileBab4, setFileBab4] = useState(null);
  const [fileBab5, setFileBab5] = useState(null);
  const [fileDapus, setFileDapus] = useState(null);

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

  const handleCategoryChange = ({ value }) => {
    setRepository({ ...repository, category_id: value });
  };

  const handleDepartementChange = ({ value }) => {
    setRepository({ ...repository, departement_id: value });
  };

  const handleLecturerChange = (value) => {
    const contributors = [];
    contributors[0] = {
      pemustaka_id: value.value,
      fullname: value.label,
    };
    setRepository({ ...repository, contributors: contributors });
  };

  const handlerSubmit = async () => {
    const data = new FormData();

    data.append('validity_page', fileValidityPage);
    data.append('cover_and_list_content', fileCoverAndListContent);
    data.append('chp_one', fileBab1);
    data.append('chp_two', fileBab2);
    data.append('chp_three', fileBab3);
    data.append('chp_four', fileBab4);
    data.append('chp_five', fileBab5);
    data.append('bibliography', fileDapus);
    data.append('author', repository?.authors[0]?.pemustaka_id || '');
    data.append('mentor', repository?.contributors[0]?.pemustaka_id || '');
    data.append('departement_id', repository?.departement_id || '');
    data.append('category_id', repository?.category_id || '');
    data.append('title', repository?.title);
    data.append('date_validated', repository?.date_validated);
    data.append('status', repository?.status);

    try {
      setLoading(true);
      const response = await setUpdateInternshipReport(repository_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Sukses edit karya tulis ilmiah.');
      router.push('/administrator/repositori');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Edit Laporan Magang Industri</title>
      </Head>

      <div className="w-full min-h-screen">
        <Navbar active="akunku" />

        <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
          <SidebarStaff data={data} role="administrator" />

          <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
            <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
              <h2 className="text-white text-lg md:text-xl font-medium">
                Edit Laporan Magang Industri
              </h2>
            </CardHeader>

            <CardBody className="p-4 md:p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Lengkapi data karya tulis ilmiah</h3>
                <div className="flex flex-col gap-1">
                  <label htmlFor="title">
                    Judul Karya Tulis Ilmiah
                    <ImportantField />
                  </label>
                  <Input
                    type="text"
                    id="title"
                    placeholder="Judul Karya Tulis Ilmiah"
                    value={repository?.title}
                    onChange={(event) =>
                      setRepository({ ...repository, title: event.target.value })
                    }
                    error={errors?.title}
                  />
                  {errors && <p className="text-red text-sm">{errors?.title}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="category">
                    Pilih Kategori
                    <ImportantField />
                  </label>
                  <SelectCategory
                    error={errors?.category_id}
                    onCategoryChange={handleCategoryChange}
                    defaultValue={repository?.category}
                  />
                  {errors && <p className="text-red text-sm">{errors?.category_id}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="departement">
                    Pilih Jurusan
                    <ImportantField />
                  </label>
                  <SelectDepartement
                    error={errors?.departement_id}
                    onDepartementChange={handleDepartementChange}
                    defaultValue={repository?.departement}
                  />
                  {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="first_mentor">
                    Pilih Pembimbing
                    <ImportantField />
                  </label>
                  <SelectLecture
                    onLectureChange={handleLecturerChange}
                    error={errors?.mentor}
                    defaultValue={repository?.contributors[0]?.fullname}
                  />
                  {errors && <p className="text-red text-sm">{errors?.mentor}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="validated_date">
                    Tanggal Disahkan
                    <ImportantField />
                  </label>
                  <Input
                    type="date"
                    error={errors?.date_validated}
                    id="date_validated"
                    value={repository.date_validated}
                    onChange={(event) =>
                      setRepository({ ...repository, date_validated: event.target.value })
                    }
                  />
                  {errors && <p className="text-red text-sm">{errors?.date_validated}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-black" htmlFor="gender">
                    Status <ImportantField />
                  </label>
                  <Listbox
                    value={repository?.status}
                    onChange={(value) => setRepository({ ...repository, status: value })}
                  >
                    <div className="relative">
                      <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                        <span className="block truncate text-start">
                          {repository?.status === 'denied'
                            ? 'Ditolak'
                            : repository?.status === 'approved'
                            ? 'Disetujui'
                            : 'Menunggu konfirmasi'}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                          <RiArrowDropDownLine
                            className="h-5 w-5 text-gray-400"
                            aria-hidden="true"
                          />
                        </span>
                      </Listbox.Button>
                      <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 px-4 ${
                              active ? 'bg-green/10 text-black' : 'text-secondary'
                            }`
                          }
                          value="pending"
                        >
                          Menunggu konfirmasi
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 px-4 ${
                              active ? 'bg-green/10 text-black' : 'text-secondary'
                            }`
                          }
                          value="approved"
                        >
                          Disetujui
                        </Listbox.Option>
                        <Listbox.Option
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 px-4 ${
                              active ? 'bg-green/10 text-black' : 'text-secondary'
                            }`
                          }
                          value="denied"
                        >
                          Ditolak
                        </Listbox.Option>
                      </Listbox.Options>
                    </div>
                  </Listbox>
                </div>
              </div>

              <Divider />

              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-medium">Ubah dokumen karya tulis ilmiah</h3>
                <div className="flex flex-col gap-1">
                  <label>Halaman Pengesahan</label>
                  <InputFile
                    target="pengesahan"
                    file={fileValidityPage}
                    setFile={setFileValidityPage}
                    accept="application/pdf"
                    error={errors?.validity_page}
                  />
                  {errors && <p className="text-red text-sm">{errors?.validity_page}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Cover dan Daftar Isi</label>
                  <InputFile
                    target="cover_and_list_content"
                    file={fileCoverAndListContent}
                    setFile={setCoverAndListContent}
                    accept="application/pdf"
                    error={errors?.cover_and_list_content}
                  />
                  {errors && <p className="text-red text-sm">{errors?.cover_and_list_content}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>BAB I</label>
                  <InputFile
                    target="bab1"
                    file={fileBab1}
                    setFile={setFileBab1}
                    accept="application/pdf"
                    error={errors?.chp_one}
                  />
                  {errors && <p className="text-red text-sm">{errors?.chp_one}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>BAB II</label>
                  <InputFile
                    target="bab2"
                    file={fileBab2}
                    setFile={setFileBab2}
                    accept="application/pdf"
                    error={errors?.chp_two}
                  />
                  {errors && <p className="text-red text-sm">{errors?.chp_two}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>BAB III</label>
                  <InputFile
                    target="bab3"
                    file={fileBab3}
                    setFile={setFileBab3}
                    accept="application/pdf"
                    error={errors?.chp_three}
                  />
                  {errors && <p className="text-red text-sm">{errors?.chp_three}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>BAB IV</label>
                  <InputFile
                    target="bab4"
                    file={fileBab4}
                    setFile={setFileBab4}
                    accept="application/pdf"
                    error={errors?.chp_four}
                  />
                  {errors && <p className="text-red text-sm">{errors?.chp_four}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>BAB V</label>
                  <InputFile
                    target="bab5"
                    file={fileBab5}
                    setFile={setFileBab5}
                    accept="application/pdf"
                    error={errors?.chp_five}
                  />
                  {errors && <p className="text-red text-sm">{errors?.chp_five}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label>Daftar Pustaka</label>
                  <InputFile
                    target="dapus"
                    file={fileDapus}
                    setFile={setFileDapus}
                    accept="application/pdf"
                    error={errors?.bibliography}
                  />
                  {errors && <p className="text-red text-sm">{errors?.bibliography}</p>}
                </div>
              </div>
            </CardBody>

            <Divider />

            <CardFooter className="flex items-center justify-center p-6 gap-4">
              {!loading && (
                <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handlerSubmit}>
                  Simpan
                </ButtonFilled>
              )}
              {loading && (
                <button
                  className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
                  disabled
                >
                  Memuat . . .
                </button>
              )}
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default EditInternshipReportAdministrator;

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
