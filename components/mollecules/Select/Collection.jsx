import { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../../hooks/use-debounce';
import { getAllCollections } from '../../../services/collection';
import Select from 'react-select';
import DropdownIndicator from '../../atoms/DropdownIndicator';

const SelectCollection = ({ error, onCollectionChange, visibility }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState('');
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const collectionDeb = useDebounce(search, 500);
  const getCollectionsAPI = useCallback(async (keyword, visibility) => {
    try {
      setLoading(true);

      const response = await getAllCollections(keyword, visibility, 5, 0);

      const transformedResponses = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setCollections(transformedResponses);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCollectionsAPI(collectionDeb, visibility);
  }, [getCollectionsAPI, collectionDeb, visibility]);

  useEffect(() => {
    if (document.body !== 'undefined') {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleSearchInputChange = (inputValue) => {
    setSearch(inputValue);
  };

  const handleCollectionChange = (option) => {
    setSelectedOption(option);
    onCollectionChange(option ?? '');
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
      placeholder="Pilih Koleksi"
      noOptionsMessage={() => 'Koleksi tidak ditemukan'}
      options={collections}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleCollectionChange}
      isLoading={loading}
      menuPortalTarget={menuPortalTarget}
      loadingMessage={() => 'Memuat . . .'}
      menuPlacement="auto"
      isClearable
    />
  );
};

export default SelectCollection;
