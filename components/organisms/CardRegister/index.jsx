import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setRegisterPemustaka } from '../../../services/auth';
import { ButtonFilled } from '../../atoms/Button';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import ImportantField from '../../atoms/Important';
import { Input, InputFile } from '../../atoms/Input';
import { VscEyeClosed, VscEye } from 'react-icons/vsc';
import SelectProdi from '../../mollecules/SelectProdi';
import SelectDepartement from '../../mollecules/SelectDepartement';
import SelectRole from '../../mollecules/SelectRole';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { regex } from '../../../helper/regex';

const CardRegister = () => {
  const [index, setIndex] = useState(1);
  const [hide, setHide] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setName] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [departement, setDepartement] = useState({
    id: '',
    name: '',
  });
  const [role, setRole] = useState({
    id: '',
    name: '',
  });
  const [identityNumber, setIdentityNumber] = useState('');
  const [yearGen, setYearGen] = useState('');
  const [evidence, setEvidence] = useState(null);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(null);

  const router = useRouter();

  const handleRegister = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('email', email?.trim());
    data.append('password', password?.trim());
    data.append('fullname', fullname);
    data.append('identity_number', identityNumber?.trim());
    data.append('year_gen', yearGen?.trim());
    data.append('departement_id', departement?.id?.trim());
    data.append('study_program_id', studyProgram?.trim());
    data.append('role_id', role.id?.trim());
    data.append('support_evidence', evidence);

    try {
      setLoading(true);
      const response = await setRegisterPemustaka(data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Mohon isi data dengan lengkap.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        return;
      }

      toast.success('Yeay, register berhasil.');
      router.push('/auth/masuk');
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setYearGen('');
  }, [role]);

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden py-4 lg:py-8">
      <CardHeader>
        <h2 className="text-center font-semibold text-2xl lg:text-4xl mb-4 md:mb-8">Register</h2>
      </CardHeader>

      <Divider />

      <CardBody className="w-full bg-white p-4 md:px-12 lg:px-32 lg:py-8 flex flex-col gap-6">
        {index === 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Masukkan email dan password</h3>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">
                Email <ImportantField />
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Alamat email"
                value={email}
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
          </div>
        )}

        {index === 2 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">Lengkapi data diri</h3>
            <div className="flex flex-col gap-1">
              <label htmlFor="fullname">
                Nama Lengkap <ImportantField />
              </label>
              <Input
                id="fullname"
                type="text"
                placeholder="Nama Lengkap"
                value={fullname}
                onChange={(event) => setName(event.target.value)}
                error={errors?.fullname}
              />
              {errors && <p className="text-red text-sm">{errors?.fullname}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="departement">
                Jurusan <ImportantField />
              </label>
              <SelectDepartement
                error={errors?.departement_id}
                departement={departement}
                setDepartement={setDepartement}
              />
              {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="study_program">
                Program Studi <ImportantField />
              </label>
              <SelectProdi
                error={errors?.study_program_id}
                studyProgram={studyProgram}
                setStudyProgram={setStudyProgram}
                departement={departement}
              />
              {errors && <p className="text-red text-sm">{errors?.study_program_id}</p>}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="role">
                Role <ImportantField />
              </label>
              <SelectRole error={errors?.role_id} role={role} setRole={setRole} />
              {errors && <p className="text-red text-sm">{errors?.role_id}</p>}
            </div>
            {role?.name === 'Mahasiswa' && (
              <>
                <div className="flex flex-col gap-1">
                  <label htmlFor="identity_number">
                    NIM <ImportantField />
                  </label>
                  <Input
                    id="identity_number"
                    type="text"
                    placeholder="Nomor Induk Mahasiswa"
                    value={identityNumber}
                    onChange={(event) => setIdentityNumber(regex.numeric(event.target.value, 50))}
                    error={errors?.identity_number}
                  />
                  {errors && <p className="text-red text-sm">{errors?.identity_number}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="year_gen">
                    Tahun Angkatan <ImportantField />
                  </label>
                  <Input
                    id="year_gen"
                    type="text"
                    placeholder="Tahun Angkatan"
                    value={yearGen}
                    onChange={(event) => setYearGen(regex.numeric(event.target.value, 4))}
                    error={errors?.year_gen}
                  />
                  {errors && <p className="text-red text-sm">{errors?.year_gen}</p>}
                </div>
              </>
            )}

            {role?.name === 'Dosen' && (
              <div className="flex flex-col gap-1">
                <label htmlFor="identity_number">
                  NIDN <ImportantField />
                </label>
                <Input
                  id="identity_number"
                  type="text"
                  placeholder="Nomor Induk Dosen Nasional"
                  value={identityNumber}
                  onChange={(event) => setIdentityNumber(regex.numeric(event.target.value, 50))}
                  error={errors?.identity_number}
                />
                {errors && <p className="text-red text-sm">{errors?.identity_number}</p>}
              </div>
            )}
          </div>
        )}

        {index === 3 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-medium">
              Unggah berkas pendukung bahwa Anda terdaftar di PNC
            </h3>
            <div className="flex flex-col gap-1">
              <label htmlFor="sup_evidence">
                Unggah foto pendukung seperti KTM atau sejenisnya <ImportantField />
              </label>
              <InputFile
                accept="image/*"
                target="support_evidence"
                file={evidence}
                setFile={setEvidence}
                error={errors?.support_evidence}
              />
              {errors && <p className="text-red text-sm">{errors?.support_evidence}</p>}
            </div>
          </div>
        )}
        <p className="text-end">{index} dari 3</p>
      </CardBody>

      <Divider />

      <CardFooter className="w-full flex flex-col items-center justify-center gap-4 lg:gap-6 mt-4 md:mt-8">
        {index === 1 && (
          <ButtonFilled bgcolor="bg-orange/80 hover:bg-orange" onClick={() => setIndex(2)}>
            Selanjutnya
          </ButtonFilled>
        )}
        {index === 2 && (
          <div className="flex items-center gap-4">
            <button
              className="p-2 w-40 lg:w-40 2xl:w-48 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5"
              onClick={() => setIndex(1)}
            >
              Kembali
            </button>
            <ButtonFilled bgcolor="bg-orange/80 hover:bg-orange" onClick={() => setIndex(3)}>
              Selanjutnya
            </ButtonFilled>
          </div>
        )}
        {index === 3 && (
          <div className="flex items-center gap-4">
            <button
              className="p-2 w-40 lg:w-40 2xl:w-48 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5"
              onClick={() => setIndex(2)}
            >
              Kembali
            </button>
            {loading && (
              <button
                className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
                disabled
              >
                Memuat . . .
              </button>
            )}

            {!loading && (
              <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handleRegister}>
                Daftar
              </ButtonFilled>
            )}
          </div>
        )}
        <p>
          Sudah punya akun?{' '}
          <Link href="/auth/masuk">
            <a className="text-blue/80 hover:text-blue font-semibold">Masuk</a>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};

export default CardRegister;
