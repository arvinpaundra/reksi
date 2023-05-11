import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { ROLE_DOSEN_ID } from '../../../constants';
import useDebounce from '../../../hooks/use-debounce';
import { getAllPemustaka } from '../../../services/pemustaka';

const SelectLecture = (props) => {
  const { lecture, setLecture, placeholder, error } = props;

  const [dataLecturers, setDataLecturers] = useState([]);
  const [loading, setLoading] = useState(null);

  const [searchLecture, setSearchLecture] = useState('');
  const lecturerDeb = useDebounce(searchLecture, 500);
  const getLecturersAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await getAllPemustaka(keyword, ROLE_DOSEN_ID, '', '', '', 5, 0);

      setDataLecturers(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLecturersAPI(lecturerDeb);
  }, [getLecturersAPI, lecturerDeb]);

  return (
    <Combobox value={lecture} onChange={setLecture}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white focus:outline-none">
          <Combobox.Input
            placeholder={placeholder}
            className={`w-full h-[42px] border ${
              error ? 'border-red' : 'border-black/50'
            } rounded-xl py-2 pl-4 pr-8 outline-none focus:border-blue`}
            displayValue={(lecture) => lecture.fullname}
            onChange={(event) => setSearchLecture(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10">
            <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition as={Fragment} afterLeave={() => setSearchLecture('')}>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-md focus:outline-none z-10">
            {loading && (
              <div className="relative p-2">
                <p className="text-center font-medium">Memuat . . .</p>
              </div>
            )}

            {dataLecturers?.length &&
              !loading &&
              dataLecturers?.map((data) => (
                <Combobox.Option
                  key={data.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-green/10 text-black' : 'text-secondary'
                    }`
                  }
                  value={data}
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-medium">{data.fullname}</p>
                    <p className="text-sm text-secondary">{data.identity_number}</p>
                  </div>
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SelectLecture;
