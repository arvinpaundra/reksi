import { Listbox } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { getStudyProgramsByDepartement } from '../../../services/study_program';

const SelectProdi = ({ error, studyProgram, setStudyProgram, departement }) => {
  const [dataProdi, setDataProdi] = useState([]);

  const getProdiAPI = useCallback(async (departement_id) => {
    try {
      const response = await getStudyProgramsByDepartement(departement_id);

      setDataProdi(response?.data);
    } catch (err) {}
  }, []);

  const { id: departement_id } = departement;

  useEffect(() => {
    if (departement_id) {
      getProdiAPI(departement_id);
    }
  }, [getProdiAPI, departement_id]);

  const studyPrograms = dataProdi?.filter((data) => studyProgram === data?.id);

  return (
    <Listbox value={studyProgram} onChange={(event) => setStudyProgram(event)}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full border ${
            error ? 'border-red' : 'border-black/50'
          } text-start rounded-xl py-2 px-4 outline-none focus:border-blue`}
        >
          {studyPrograms?.length ? (
            <span className="block truncate">{studyPrograms[0]?.name}</span>
          ) : (
            <span className="text-secondary">Pilih Program Studi</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 shadow-md focus:outline-none">
          {dataProdi?.length ? (
            dataProdi?.map((data) => (
              <Listbox.Option
                key={data.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-4 ${
                    active ? 'bg-green/10 text-black' : 'text-secondary'
                  }`
                }
                value={data.id}
              >
                {data.name}
              </Listbox.Option>
            ))
          ) : (
            <Listbox.Option
              className={
                'relative cursor-default select-none py-2 px-4 bg-green/10 text-black text-center'
              }
            >
              Data tidak ditemukan.
            </Listbox.Option>
          )}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectProdi;
