import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setCreateFinalProjectReport } from '../../../services/repository';
import { ButtonFilled } from '../../atoms/Button';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import ImportantField from '../../atoms/Important';
import { Input, InputFile } from '../../atoms/Input';
import SelectCategory from '../../mollecules/Select/Category';
import SelectLecture from '../../mollecules/Select/Lecture';
import SelectDepartement from '../../mollecules/Select/Departement';

const CardFinalProject = (props) => {
  const { user } = props;

  const router = useRouter();

  const [index, setIndex] = useState(1);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const [repository, setRepository] = useState({
    title: '',
    abstract: '',
    date_validated: '',
    improvement: '',
    related_title: '',
    update_desc: '',
  });

  const [category, setCategory] = useState('');
  const [departement, setDepartement] = useState('');
  const [firstMentor, setFirstMentor] = useState('');
  const [secondMentor, setSecondMentor] = useState('');
  const [firstExaminer, setFirstExaminer] = useState('');
  const [secondExaminer, setSecondExaminer] = useState('');
  const [improvement, setImprovement] = useState(false);
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
    data.append('departement_id', departement || '');
    data.append('category_id', category || '');
    data.append('author', user?.id || '');
    data.append('first_examiner', firstExaminer || '');
    data.append('second_examiner', secondExaminer || '');
    data.append('first_mentor', firstMentor || '');
    data.append('second_mentor', secondMentor || '');
    data.append('title', repository?.title);
    data.append('abstract', repository?.abstract);
    data.append('date_validated', repository?.date_validated);
    data.append('improvement', improvement ? '1' : '0');
    data.append('related_title', repository?.related_title);
    data.append('update_desc', repository?.update_desc);

    try {
      setLoading(true);

      const response = await setCreateFinalProjectReport(data);

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

  const handleFirstMentorChange = ({ value }) => {
    setFirstMentor(value);
  };

  const handleSecondMentorChange = ({ value }) => {
    setSecondMentor(value);
  };

  const handleFirstExaminerChange = ({ value }) => {
    setFirstExaminer(value);
  };

  const handleSecondExaminerChange = ({ value }) => {
    setSecondExaminer(value);
  };

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
      <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
        <h2 className="text-white text-lg md:text-xl font-medium">Unggah Laporan Tugas Akhir</h2>
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
            <label htmlFor="category">
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
              Pilih Pembimbing 1
              <ImportantField />
            </label>
            <SelectLecture onLectureChange={handleFirstMentorChange} error={errors?.first_mentor} />
            {errors && <p className="text-red text-sm">{errors?.first_mentor}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="second_mentor">
              Pilih Pembimbing 2
              <ImportantField />
            </label>
            <SelectLecture
              onLectureChange={handleSecondMentorChange}
              error={errors?.second_mentor}
            />
            {errors && <p className="text-red text-sm">{errors?.second_mentor}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="first_examiner">
              Pilih Penguji 1
              <ImportantField />
            </label>
            <SelectLecture
              onLectureChange={handleFirstExaminerChange}
              error={errors?.first_examiner}
            />
            {errors && <p className="text-red text-sm">{errors?.first_examiner}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="second_examiner">
              Pilih Penguji 2
              <ImportantField />
            </label>
            <SelectLecture
              onLectureChange={handleSecondExaminerChange}
              error={errors?.second_examiner}
            />
            {errors && <p className="text-red text-sm">{errors?.second_examiner}</p>}
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
            <label htmlFor="abstract">
              Abstrak
              <ImportantField />
            </label>
            <textarea
              className={`relative w-full border ${
                errors?.abstract ? 'border-red' : 'border-black/50'
              } rounded-xl py-2 px-4 outline-none focus:border-blue`}
              placeholder="Abstrak"
              rows={5}
              value={repository.abstract}
              onChange={(event) => setRepository({ ...repository, abstract: event.target.value })}
            />
            {errors && <p className="text-red text-sm">{errors?.abstract}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-start gap-2">
              <input
                type="checkbox"
                id="improvement"
                className="w-4 h-4 accent-green"
                onChange={(event) => setImprovement(event.target.checked)}
                checked={improvement}
              />
              <label htmlFor="improvement">Pengembangan Judul</label>
            </div>
            {errors && <p className="text-red text-sm">{errors?.improvement}</p>}
          </div>
          {improvement && (
            <>
              <div className="flex flex-col gap-1">
                <label htmlFor="related_title">Judul Terkait</label>
                <Input
                  type="text"
                  id="related_title"
                  placeholder="Judul Terkait"
                  value={repository.related_title}
                  onChange={(event) =>
                    setRepository({ ...repository, related_title: event.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="update_desc">Deskripsi Pengembangan</label>
                <textarea
                  id="update_desc"
                  className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                  placeholder="Deskripsikan pengembangan yang diimplementasi"
                  value={repository.update_desc}
                  onChange={(event) =>
                    setRepository({ ...repository, update_desc: event.target.value })
                  }
                />
              </div>
            </>
          )}
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
  );
};

export default CardFinalProject;
