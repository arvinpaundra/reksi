import jwtDecode from 'jwt-decode';
import Head from 'next/head';
import Navbar from '../../../../components/organisms/Navbar';
import SidebarStaff from '../../../../components/organisms/Sidebar/SidebarStaff';
import CardFooter from '../../../../components/atoms/Card/CardFooter';
import Divider from '../../../../components/atoms/Divider';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import Card from '../../../../components/atoms/Card';
import CardHeader from '../../../../components/atoms/Card/CardHeader';
import CardBody from '../../../../components/atoms/Card/CardBody';
import { Input, InputFile } from '../../../../components/atoms/Input';
import ImportantField from '../../../../components/atoms/Important';
import SelectDepartement from '../../../../components/mollecules/Select/Departement';
import { ButtonFilled } from '../../../../components/atoms/Button';
import Footer from '../../../../components/organisms/Footer';
import SelectPemustaka from '../../../../components/mollecules/Select/Pemustaka';
import { setCreateInternshipReport } from '../../../../services/repository';
import SelectLecture from '../../../../components/mollecules/Select/Lecture';
import SelectCategory from '../../../../components/mollecules/Select/Category';

const AdministratorMagangIndustri = ({ data }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const [repository, setRepository] = useState({
    title: '',
    date_validated: '',
    improvement: '',
    related_title: '',
    update_desc: '',
  });

  const [category, setCategory] = useState('');
  const [departement, setDepartement] = useState('');
  const [author, setAuthor] = useState('');
  const [mentor, setMentor] = useState('');
  const [fileValidityPage, setFileValidityPage] = useState(null);
  const [fileCoverAndListContent, setCoverAndListContent] = useState(null);
  const [fileBab1, setFileBab1] = useState(null);
  const [fileBab2, setFileBab2] = useState(null);
  const [fileBab3, setFileBab3] = useState(null);
  const [fileBab4, setFileBab4] = useState(null);
  const [fileBab5, setFileBab5] = useState(null);
  const [fileDapus, setFileDapus] = useState(null);

  const handlerUpload = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('validity_page', fileValidityPage);
    data.append('cover_and_list_content', fileCoverAndListContent);
    data.append('chp_one', fileBab1);
    data.append('chp_two', fileBab2);
    data.append('chp_three', fileBab3);
    data.append('chp_four', fileBab4);
    data.append('chp_five', fileBab5);
    data.append('bibliography', fileDapus);
    data.append('author', author || '');
    data.append('mentor', mentor || '');
    data.append('departement_id', departement || '');
    data.append('category_id', category || '');
    data.append('title', repository?.title);
    data.append('date_validated', repository?.date_validated);

    try {
      setLoading(true);

      const response = await setCreateInternshipReport(data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay! Sukses unggah karya tulis ilmiah.');
      router.push('/administrator/repositori');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = ({ value }) => {
    setCategory(value);
  };

  const handleAuthorChange = (_, { value }) => {
    setAuthor(value);
  };

  const handleDepartementChange = ({ value }) => {
    setDepartement(value);
  };

  const handleLecturerChange = ({ value }) => {
    setMentor(value);
  };

  return (
    <div>
      <Head>
        <title>Tambah Laporan Magang Industri</title>
      </Head>

      <div className="w-full min-h-screen flex flex-col justify-between">
        <div>
          <Navbar active="akunku" />

          <main className="px-4 md:px-12 lg:px-24 mt-6 mb-20 lg:my-6 2xl:px-[15%] xl:grid xl:grid-cols-12 xl:gap-4">
            <SidebarStaff data={data} role="administrator" />

            <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
              <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
                <h2 className="text-white text-lg md:text-xl font-medium">
                  Unggah Laporan Magang Industri
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
                      value={repository.title}
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
                    />
                    {errors && <p className="text-red text-sm">{errors?.category_id}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="departement">
                      Pilih Jurusan
                      <ImportantField />
                    </label>
                    <SelectDepartement
                      onDepartementChange={handleDepartementChange}
                      error={errors?.departement_id}
                    />
                    {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="first_mentor">
                      Pilih Author
                      <ImportantField />
                    </label>
                    <SelectPemustaka
                      onPemustakaChange={handleAuthorChange}
                      error={errors?.author}
                      role="mahasiswa"
                    />
                    {errors && <p className="text-red text-sm">{errors?.author}</p>}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="first_mentor">
                      Pilih Pembimbing
                      <ImportantField />
                    </label>
                    <SelectLecture onLectureChange={handleLecturerChange} error={errors?.mentor} />
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
                </div>

                <Divider />

                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-medium">Unggah dokumen karya tulis ilmiah</h3>
                  <div className="flex flex-col gap-1">
                    <label>
                      Halaman Pengesahan
                      <ImportantField />
                    </label>
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
                    <label>
                      Cover dan Daftar Isi
                      <ImportantField />
                    </label>
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
                    <label>
                      BAB I
                      <ImportantField />
                    </label>
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
                    <label>
                      BAB II
                      <ImportantField />
                    </label>
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
                    <label>
                      BAB III
                      <ImportantField />
                    </label>
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
                    <label>
                      BAB IV
                      <ImportantField />
                    </label>
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
                    <label>
                      BAB V
                      <ImportantField />
                    </label>
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
                    <label>
                      Daftar Pustaka
                      <ImportantField />
                    </label>
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
                {loading && (
                  <button
                    className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
                    disabled
                  >
                    Memuat . . .
                  </button>
                )}

                {!loading && (
                  <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handlerUpload}>
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

export default AdministratorMagangIndustri;

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
