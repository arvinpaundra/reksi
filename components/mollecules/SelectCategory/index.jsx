import { Combobox, Transition } from '@headlessui/react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import useDebounce from '../../../hooks/use-debounce';
import { getAllCategories } from '../../../services/category';

const SelectCategory = (props) => {
  const { error, category, setCategory } = props;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState('');

  const categoryDeb = useDebounce(search, 500);
  const getCategoriesAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);

      const response = await getAllCategories(keyword, 5, 0);

      setCategories(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCategoriesAPI(categoryDeb);
  }, [getCategoriesAPI, categoryDeb]);

  return (
    <Combobox value={category} onChange={setCategory}>
      <div className="relative">
        <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white focus:outline-none">
          <Combobox.Input
            placeholder="Pilih Kategori"
            className={`w-full h-[42px] border ${
              error ? 'border-red' : 'border-black/50'
            } rounded-xl py-2 pl-4 pr-8 outline-none focus:border-blue`}
            displayValue={(cat) => cat.name}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Combobox.Button className="absolute inset-y-0 right-0 top-1 flex items-center justify-center w-10 h-5/6 cursor-pointer rounded-full hover:bg-blue/10">
            <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </Combobox.Button>
        </div>
        <Transition as={Fragment} afterLeave={() => setSearch('')}>
          <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-md focus:outline-none z-10">
            {loading && (
              <div className="relative p-2" key="-">
                <p className="text-center font-medium">Memuat . . .</p>
              </div>
            )}

            {categories &&
              !loading &&
              categories?.map((cat) => (
                <Combobox.Option
                  key={cat.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 px-4 ${
                      active ? 'bg-green/10 text-black' : 'text-secondary'
                    }`
                  }
                  value={cat}
                >
                  {cat.name}
                </Combobox.Option>
              ))}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default SelectCategory;
