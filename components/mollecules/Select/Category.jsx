import { useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { getCategories } from '../../../services/category';
import useDebounce from '../../../hooks/use-debounce';
import DropdownIndicator from '../../atoms/DropdownIndicator';

const SelectCategory = ({ error, onCategoryChange, defaultValue = null }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);
  const [search, setSearch] = useState('');
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const categoryDeb = useDebounce(search, 500);
  const getCategoriesAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await getCategories(keyword, 5, 0);
      const transformedResponses = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setCategories(transformedResponses);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const getDefaultValue = useCallback(async (defaultValue) => {
    try {
      setLoadingDefault(true);

      const defaultCategory = await getCategories(defaultValue, 1, 0);
      const defaultLabelCategory = defaultCategory?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setSelectedOption(defaultLabelCategory);
    } catch (error) {
    } finally {
      setLoadingDefault(false);
    }
  }, []);

  useEffect(() => {
    getCategoriesAPI(categoryDeb);
  }, [getCategoriesAPI, categoryDeb]);

  useEffect(() => {
    if (defaultValue) {
      getDefaultValue(defaultValue);
    }
  }, [getDefaultValue, defaultValue]);

  useEffect(() => {
    if (document.body !== 'undefined') {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleSearchInputChange = (inputValue) => {
    setSearch(inputValue);
  };

  const handleCategoryChange = (option) => {
    setSelectedOption(option);
    onCategoryChange(option ?? '');
  };

  return (
    <Select
      className="w-full"
      components={{ DropdownIndicator }}
      styles={{
        placeholder: (provided) => ({
          ...provided,
          color: 'rgb(0 0 0 / 0.5)',
        }),
        control: (provided, state) => ({
          ...provided,
          borderColor: error ? '#D94555' : state.isFocused ? '#0085c8' : 'rgb(0 0 0 / 0.5)',
          borderRadius: '0.75rem',
          '&:hover': {
            borderColor: 'border-black/50',
          },
        }),
        option: (provided, state) => ({
          ...provided,
          padding: '8px 16px',
          color: 'black',
          backgroundColor: state.isFocused ? 'rgb(0 161 117 / 0.1)' : 'white',
          zIndex: 1000,
        }),
        menu: (provided, state) => ({
          ...provided,
          zIndex: 9999,
        }),
        menuPortal: (provided, staate) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
      placeholder="Pilih Kategori"
      noOptionsMessage={() => 'Kategori tidak ditemukan'}
      options={categories}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleCategoryChange}
      menuPortalTarget={menuPortalTarget}
      isLoading={loading || loadingDefault}
      loadingMessage={() => 'Memuat . . .'}
      getOptionValue={(option) => option.value}
      getOptionLabel={(option) => option.label}
      menuPlacement="auto"
      isClearable
    />
  );
};

export default SelectCategory;
