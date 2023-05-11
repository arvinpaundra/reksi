import { ButtonFilled } from '../../atoms/Button';
import CardFooter from '../../atoms/Card/CardFooter';
import Divider from '../../atoms/Divider';
import { Input, InputFile } from '../../atoms/Input';
import ImportantField from '../../atoms/Important';
import { PatternFormat } from 'react-number-format';
import CardBody from '../../atoms/Card/CardBody';
import CardHeader from '../../atoms/Card/CardHeader';
import Card from '../../atoms/Card';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { setCreateResearchReport } from '../../../services/repository';
import { IoAddCircleOutline } from 'react-icons/io5';
import { BsFillTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import SelectCollection from '../../mollecules/Select/Collection';
import SelectPemustaka from '../../mollecules/Select/Pemustaka';
import SelectDepartement from '../../mollecules/Select/Departement';

const CardResearchReport = (props) => {
  const { user } = props;

  const router = useRouter();

  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});

  const [repository, setRepository] = useState({
    title: '',
    date_validated: '',
    abstract: '',
  });

  const [collection, setCollection] = useState('');
  const [departement, setDepartement] = useState('');
  const [authors, setAuthors] = useState([]);
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
    data.append('authors', authors || []);
    data.append('collection_id', collection || '');
    data.append('departement_id', departement || '');
    data.append('title', repository?.title);
    data.append('abstract', repository?.abstract);
    data.append('date_validated', repository?.date_validated);

    try {
      setLoading(true);

      const response = await setCreateResearchReport(data);

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

      toast.success('Yeay! Sukses unggah repositori.');
      if (user?.role === 'Dosen') {
        router.push('/dosen/repositori/dibuat');
      } else if (user?.role === 'Mahasiswa') {
        router.push('/mahasiswa/repositori');
      }
      setErrors({});
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addSelectPemustaka = () => {
    setAuthors([...authors, '']);
  };

  const removeSelectPemustaka = (index) => {
    let newAuthors = [...authors];
    newAuthors.splice(index, 1);
    setAuthors(newAuthors);
  };

  const handlePemustakaChange = (i, { value }) => {
    let newAuthors = [...authors];
    newAuthors[i] = value;
    setAuthors(newAuthors);
  };

  const handleCollectionChange = ({ value }) => {
    setCollection(value || '');
  };

  const handleDepartementChange = ({ value }) => {
    setDepartement(value || '');
  };

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
      <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
        <h2 className="text-white text-lg md:text-xl font-medium">Unggah Laporan Penelitian</h2>
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
              onChange={(value) => setRepository({ ...repository, title: value })}
              error={errors?.title}
            />
            {errors && <p className="text-red text-sm">{errors?.title}</p>}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="collection">
              Pilih Koleksi
              <ImportantField />
            </label>
            <SelectCollection
              onCollectionChange={handleCollectionChange}
              visibility="Semua"
              error={errors?.collection_id}
            />
            {errors && <p className="text-red text-sm">{errors?.collection_id}</p>}
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
            <div
              className={`flex flex-col gap-4 items-start border ${
                errors?.authors ? 'border-red' : 'border-black/50'
              } p-4 rounded-xl`}
            >
              <button
                className="py-2 px-3 w-fit text-white rounded-xl bg-blue/80 hover:bg-blue flex items-center gap-1"
                onClick={addSelectPemustaka}
              >
                <IoAddCircleOutline size={18} />
                <p className="text-sm">Tambah author</p>
              </button>

              {authors.length > 0 && (
                <div className="flex flex-col gap-3 w-full">
                  {authors.map((_, i) => (
                    <div key={i} className="flex items-center gap-2 w-full">
                      <SelectPemustaka index={i} onPemustakaChange={handlePemustakaChange} />

                      {i > 0 && (
                        <button
                          className="p-4 text-red hover:bg-red/10 rounded-full"
                          onClick={() => removeSelectPemustaka(i)}
                        >
                          <BsFillTrashFill size={17} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors && <p className="text-red text-sm">{errors?.authors}</p>}
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

export default CardResearchReport;

const PatternFormatError = (props) => {
  return (
    <input
      className="border border-red rounded-xl py-2 px-4 outline-none focus:border-blue w-full"
      {...props}
    />
  );
};
