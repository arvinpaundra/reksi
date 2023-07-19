import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import useDebounce from '../../../hooks/use-debounce';
import { getAllPemustaka } from '../../../services/pemustaka';

const SelectPemustaka = (props) => {
  const { error, pemustaka, setPemustaka } = props;

  const [loading, setLoading] = useState(null);

  const [dataPemustaka, setDataPemustaka] = useState([]);
  const [searchPemustaka, setSearchPemustaka] = useState('');

  const pemsutakaDeb = useDebounce(searchPemustaka, 500);

  const getAllPemustakaAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await getAllPemustaka(keyword, '', '', '', '', '', 5, 0);

      setDataPemustaka(response?.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllPemustakaAPI(pemsutakaDeb);
  }, [getAllPemustakaAPI, pemsutakaDeb]);

  return (
    <Combobox value={pemustaka} onChange={setPemustaka}>
      <div className="relative w-full">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white focus:outline-none">
          <Combobox.Input
            placeholder="Pilih Pemustaka"
            className={`w-full h-[42px] border ${
              error ? 'border-red' : 'border-black/50'
            } rounded-xl py-2 pl-4 pr-8 outline-none focus:border-blue`}
            displayValue={(item) => item.fullname}
            onChange={(event) => setSearchPemustaka(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10">
            <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition as={Fragment} afterLeave={() => setSearchPemustaka('')}>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-md focus:outline-none z-10">
            {loading && (
              <div className="relative p-2" key="-">
                <p className="text-center font-medium">Memuat . . .</p>
              </div>
            )}

            {dataPemustaka &&
              !loading &&
              dataPemustaka?.map((item) => (
                <Combobox.Option
                  key={item.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-green/10 text-black' : 'text-secondary'
                    }`
                  }
                  value={item}
                >
                  {
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-medium">{item.fullname}</p>
                      <p className="text-sm text-secondary">
                        {item.role} - {item.departement}
                      </p>
                    </div>
                  }
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SelectPemustaka;
