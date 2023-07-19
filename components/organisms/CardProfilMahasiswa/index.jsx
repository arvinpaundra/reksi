/* eslint-disable @next/next/no-img-element */
import { Listbox } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { getDetailPemustaka, setUpdateProfilePemustaka } from '../../../services/pemustaka';
import { ButtonFilled } from '../../atoms/Button';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import { Input } from '../../atoms/Input';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { PatternFormat } from 'react-number-format';
import ImportantField from '../../atoms/Important';
import SelectProdi from '../../mollecules/SelectProdi';
import SelectDepartement from '../../mollecules/SelectDepartement';
import { toast } from 'react-toastify';
import { FormatDateIntl } from '../../../helper/format_date_intl';
import { regex } from '../../../helper/regex';

const CardProfilMahasiswa = (props) => {
  const { data } = props;

  const [enableEdit, setEnableEdit] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [pemustaka, setPemustaka] = useState({
    pemustaka_id: '',
    study_program_id: '',
    departement_id: '',
    role_id: '',
    user_id: '',
    fullname: '',
    email: '',
    study_program: '',
    departement: '',
    member_code: '',
    identity_number: '',
    is_active: '',
    role: '',
    gender: '',
    telp: '',
    birth_date: '',
    address: '',
    join_date: '',
    year_gen: '',
    is_active: '',
    is_collected_final_project: '',
    is_collected_internship_report: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });
  const [departement, setDepartement] = useState({
    id: '',
    name: '',
  });
  const [studyProgram, setStudyProgram] = useState('');

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(pemustaka_id);

      setPemustaka(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: pemustaka_id } = data;

  useEffect(() => {
    if (isFetching) {
      getDetailPemustakaAPI(pemustaka_id);
    }

    setIsFetching(false);
  }, [getDetailPemustakaAPI, pemustaka_id, isFetching]);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();

    const data = new FormData();

    data.append('departement_id', departement?.id || '');
    data.append('study_program_id', studyProgram || '');
    data.append('fullname', pemustaka?.fullname || '');
    data.append('identity_number', pemustaka?.identity_number || '');
    data.append('year_gen', pemustaka?.year_gen || '');
    data.append('gender', pemustaka?.gender || '');
    data.append('telp', pemustaka?.telp || '');
    data.append('birth_date', pemustaka?.birth_date || '');
    data.append('address', pemustaka?.address || '');
    data.append('role_id', pemustaka.role_id || '');
    data.append('email', pemustaka.email || '');
    data.append('is_collected_final_project', pemustaka.is_collected_final_project);
    data.append('is_collected_internship_report', pemustaka.is_collected_internship_report);
    data.append('is_active', pemustaka.is_active);
    data.append('avatar', avatar);

    try {
      setLoading(true);

      const response = await setUpdateProfilePemustaka(pemustaka_id, data);

      if (response?.code === 400) {
        setErrors(response?.errors);
        toast.warning('Silahkan isi data sesuai dengan petunjuk.', { toastId: 'warning' });
        return;
      }

      if (response?.code >= 300) {
        toast.error(response?.message, { toastId: 'error' });
        setErrors({});
        return;
      }

      toast.success('Data profil berhasil diperbaharui!', { toastId: 'success' });
      setErrors({});
      setEnableEdit(false);
    } catch (error) {
    } finally {
      setLoading(false);
      setIsFetching(true);
    }
  };

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
      <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
        <h2 className="text-white text-lg md:text-xl">Profil Pemustaka</h2>
      </CardHeader>

      <CardBody className="p-4 md:p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Data Pribadi</h3>
          <div className="flex flex-col gap-1 w-fit">
            {enableEdit ? (
              <>
                <label htmlFor="avatar" className="relative rounded-full overflow-hidden">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => {
                      const img = event.target.files[0];
                      setImagePreview(URL.createObjectURL(img));

                      setAvatar(img);
                    }}
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Image"
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  ) : (
                    <img
                      src={pemustaka?.avatar}
                      alt=""
                      className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
                    />
                  )}
                  <div className="w-full h-full absolute top-0 right-0 opacity-0 hover:opacity-100 hover:bg-orange/50 hover:transition hover:ease-in-out hover:duration-300 flex items-center justify-center cursor-pointer">
                    <AiOutlineCloudUpload color="white" size={28} />
                  </div>
                </label>
                {errors && <p className="text-red text-sm">{errors?.avatar}</p>}
              </>
            ) : (
              <img
                src={pemustaka?.avatar}
                alt="Profile Image"
                className="w-20 h-20 md:w-32 md:h-32 rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
              htmlFor="name"
            >
              Nama Lengkap {enableEdit && <ImportantField />}
            </label>
            {enableEdit ? (
              <>
                <Input
                  type="text"
                  placeholder="Nama Lengkap"
                  value={pemustaka.fullname}
                  onChange={(event) => setPemustaka({ ...pemustaka, fullname: event.target.value })}
                  error={errors?.fullname}
                />
                {errors && <p className="text-red text-sm">{errors?.fullname}</p>}
              </>
            ) : (
              <p>{pemustaka.fullname}</p>
            )}
          </div>

          {!enableEdit && (
            <div className="flex flex-col gap-1">
              <label
                className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                htmlFor="email"
              >
                Email
              </label>
              <p>{pemustaka.email}</p>
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label
              className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
              htmlFor="telp"
            >
              No. Telepon
            </label>
            {enableEdit ? (
              <Input
                type="text"
                placeholder="Nomor Telepon"
                value={pemustaka.telp}
                onChange={(event) =>
                  setPemustaka({ ...pemustaka, telp: regex.numeric(event.target.value, 13) })
                }
              />
            ) : (
              <p>{!pemustaka.telp?.length ? 'Belum diisi' : pemustaka.telp}</p>
            )}
          </div>

          <div className="w-full flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
            <div className="flex flex-col gap-1 w-full md:col-span-6">
              <label
                className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                htmlFor="birth_date"
              >
                Tanggal Lahir
              </label>
              {enableEdit ? (
                <PatternFormat
                  value={pemustaka.birth_date}
                  format="##-##-####"
                  placeholder="hh-bb-tttt"
                  displayType="input"
                  type="text"
                  onValueChange={(values, sourceInfo) =>
                    setPemustaka({ ...pemustaka, birth_date: values.formattedValue })
                  }
                  mask=" "
                  customInput={Input}
                />
              ) : (
                <p>
                  {!pemustaka.birth_date?.length
                    ? 'Belum diisi'
                    : FormatDateIntl(pemustaka.birth_date)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 w-full md:col-span-6">
              <label
                className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                htmlFor="gender"
              >
                Jenis Kelamin
              </label>
              {enableEdit ? (
                <Listbox
                  value={pemustaka.gender}
                  onChange={(value) => setPemustaka({ ...pemustaka, gender: value })}
                >
                  <div className="relative">
                    <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                      <span className="block truncate text-start">
                        {!pemustaka.gender?.length ? 'Belum diisi' : pemustaka.gender}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Pria"
                      >
                        Pria
                      </Listbox.Option>
                      <Listbox.Option
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? 'bg-green/10 text-black' : 'text-secondary'
                          }`
                        }
                        value="Wanita"
                      >
                        Wanita
                      </Listbox.Option>
                    </Listbox.Options>
                  </div>
                </Listbox>
              ) : (
                <p>{!pemustaka.gender?.length ? 'Belum diisi' : pemustaka.gender}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label
              className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
              htmlFor="address"
            >
              Alamat
            </label>
            {enableEdit ? (
              <textarea
                className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                placeholder="Alamat Pemustaka"
                value={pemustaka.address}
                onChange={(event) => setPemustaka({ ...pemustaka, address: event.target.value })}
              />
            ) : (
              <p>{!pemustaka.address?.length ? 'Belum diisi' : pemustaka.address}</p>
            )}
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Informasi Akademik</h3>
          <div className="flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
            <div
              className={`flex flex-col gap-1 w-full ${
                enableEdit ? 'md:col-span-12' : 'md:col-span-6'
              }`}
            >
              <label
                className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                htmlFor="identity_number"
              >
                NIM {enableEdit && <ImportantField />}
              </label>
              {enableEdit ? (
                <>
                  <Input
                    type="text"
                    placeholder="Nomor Induk Mahasiswa"
                    value={pemustaka.identity_number}
                    onChange={(event) =>
                      setPemustaka({
                        ...pemustaka,
                        identity_number: regex.numeric(event.target.value, 50),
                      })
                    }
                    error={errors?.identity_number}
                  />
                  {errors && <p className="text-red text-sm">{errors?.identity_number}</p>}
                </>
              ) : (
                <p>{pemustaka.identity_number}</p>
              )}
            </div>
            {!enableEdit && (
              <div className="flex flex-col gap-1 w-full md:col-span-6">
                <label
                  className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                  htmlFor="member_code"
                >
                  Member ID
                </label>
                <p>{pemustaka.member_code}</p>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
              htmlFor="departement"
            >
              Jurusan {enableEdit && <ImportantField />}
            </label>
            {enableEdit ? (
              <>
                <SelectDepartement
                  error={errors?.departement_id}
                  departement={departement}
                  setDepartement={setDepartement}
                />
                {errors && <p className="text-red text-sm">{errors?.departement_id}</p>}
              </>
            ) : (
              <p>{pemustaka.departement}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label
              className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
              htmlFor="study_program"
            >
              Program Studi {enableEdit && <ImportantField />}
            </label>
            {enableEdit ? (
              <>
                <SelectProdi
                  error={errors?.study_program_id}
                  studyProgram={studyProgram}
                  setStudyProgram={setStudyProgram}
                  departement={departement}
                />
                {errors && <p className="text-red text-sm">{errors?.study_program_id}</p>}
              </>
            ) : (
              <p>{pemustaka.study_program}</p>
            )}
          </div>
          <div className="flex flex-col items-center justify-center md:grid md:grid-cols-12 gap-4">
            <div
              className={`flex flex-col gap-1 w-full ${
                enableEdit ? 'md:col-span-12' : 'md:col-span-6'
              }`}
            >
              <label
                className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                htmlFor="year_gen"
              >
                Tahun Angkatan
              </label>
              {enableEdit ? (
                <Input
                  type="text"
                  placeholder="Tahun Angkatan"
                  value={pemustaka.year_gen}
                  onChange={(event) =>
                    setPemustaka({ ...pemustaka, year_gen: regex.numeric(event.target.value, 4) })
                  }
                />
              ) : (
                <p>{!pemustaka.year_gen?.length ? 'Belum diisi' : pemustaka.year_gen}</p>
              )}
            </div>
            {!enableEdit && (
              <div className="flex flex-col gap-1 w-full md:col-span-6">
                <label
                  className={`text-sm ${enableEdit ? 'text-black' : 'text-secondary'}`}
                  htmlFor="status"
                >
                  Status Akun
                </label>
                <p>{pemustaka.is_active === '1' ? 'Aktif' : 'Non Aktif'}</p>
              </div>
            )}
          </div>
        </div>
      </CardBody>

      <Divider />

      <CardFooter className="flex items-center justify-center p-6 gap-4">
        {enableEdit ? (
          loading ? (
            <button
              className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl bg-green/60 disabled:cursor-no-drop`}
              disabled
            >
              Memuat . . .
            </button>
          ) : (
            <>
              <button
                className="p-2 w-40 lg:w-40 2xl:w-48 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5"
                onClick={() => setEnableEdit(false)}
              >
                Batal
              </button>
              <ButtonFilled bgcolor="bg-green/80 hover:bg-green" onClick={handleUpdateProfile}>
                Simpan
              </ButtonFilled>
            </>
          )
        ) : (
          <ButtonFilled
            bgcolor="bg-blue/80 hover:bg-blue"
            onClick={() => {
              setEnableEdit((prevState) => !prevState);
              setImagePreview(null);
            }}
          >
            Edit Profil
          </ButtonFilled>
        )}
      </CardFooter>
    </Card>
  );
};

export default CardProfilMahasiswa;
