import { useRouter } from 'next/router';
import { useState } from 'react';
import { PatternFormat } from 'react-number-format';
import { setCreateInternshipReport } from '../../../services/repository';
import { ButtonFilled } from '../../atoms/Button';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import ImportantField from '../../atoms/Important';
import { Input, InputFile } from '../../atoms/Input';
import { toast } from 'react-toastify';
import SelectCategory from '../../mollecules/Select/Category';
import SelectDepartement from '../../mollecules/Select/Departement';
import SelectLecture from '../../mollecules/Select/Lecture';

const CardInternshipReport = (props) => {
  const { user } = props;

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

  const [departement, setDepartement] = useState('');
  const [category, setCategory] = useState('');
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
    data.append('author', user?.id || '');
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
      router.push('/mahasiswa/repositori');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = ({ value }) => {
    setCategory(value);
  };

  const handleDepartementChange = ({ value }) => {
    setDepartement(value);
  };

  const handleLecturerChange = ({ value }) => {
    setMentor(value);
  };

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
      <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
        <h2 className="text-white text-lg md:text-xl font-medium">
          Unggah Laporan Magang Industri
        </h2>
      </CardHeader>

      <CardBody className="p-4 md:p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Lengkapi data repositori</h3>
          <div className="flex flex-col gap-1">
            <label htmlFor="title">
              Judul Repositori
              <ImportantField />
            </label>
            <Input
              type="text"
              id="title"
              placeholder="Judul Repositori"
              value={repository.title}
              onChange={(event) => setRepository({ ...repository, title: event.target.value })}
              error={errors?.title}
            />
            {errors && <p className="text-red text-sm">{errors?.title}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="category">
              Pilih Kategori
              <ImportantField />
            </label>
            <SelectCategory error={errors?.category_id} onCategoryChange={handleCategoryChange} />
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
            />
            {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
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
            {errors?.date_validated ? (
              <>
                <PatternFormat
                  value={repository.date_validated}
                  format="##-##-####"
                  placeholder="hh-bb-tttt"
                  displayType="input"
                  type="text"
                  onValueChange={(values, sourceInfo) =>
                    setRepository({ ...repository, date_validated: values.formattedValue })
                  }
                  mask=" "
                  customInput={PatternFormatError}
                />

                {errors && <p className="text-red text-sm">{errors?.date_validated}</p>}
              </>
            ) : (
              <PatternFormat
                value={repository.date_validated}
                format="##-##-####"
                placeholder="hh-bb-tttt"
                displayType="input"
                type="text"
                onValueChange={(values, sourceInfo) =>
                  setRepository({ ...repository, date_validated: values.formattedValue })
                }
                mask=" "
                customInput={Input}
              />
            )}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Unggah dokumen repositori</h3>
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
        {!loading && (
          <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handlerUpload}>
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
  );
};

const PatternFormatError = (props) => {
  return (
    <input
      className="border border-red rounded-xl py-2 px-4 outline-none focus:border-blue w-full"
      {...props}
    />
  );
};

export default CardInternshipReport;
