import { useCallback } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import { getAuthorRepositories } from '../../../services/repository';
import useDebounce from '../../../hooks/use-debounce';
import { useEffect } from 'react';
import DropdownIndicator from '../../atoms/DropdownIndicator';

const SelectRepository = ({
  error,
  onRepositoryChange = () => {},
  pemustaka_id = '',
  collection_id = '',
}) => {
  const [loading, setLoading] = useState(null);

  const [repositories, setRepositories] = useState([]);
  const [searchRepository, setSearchRepository] = useState('');
  const [selectedOption, setSelectedOption] = useState();
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const repositoryDeb = useDebounce(searchRepository, 500);

  const getAuthoredRepositoriesAPI = useCallback(async (pemustaka_id, keyword, collection_id) => {
    try {
      setLoading(true);
      const response = await getAuthorRepositories(
        pemustaka_id,
        keyword,
        collection_id,
        '',
        '',
        '',
        '',
        'created_at DESC',
        5,
        0,
      );

      const transformedData = response?.data?.map((item) => ({
        value: item.id,
        label: item.title,
      }));

      setRepositories(transformedData);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (pemustaka_id && collection_id) {
      getAuthoredRepositoriesAPI(pemustaka_id, repositoryDeb, collection_id);
    }
  }, [getAuthoredRepositoriesAPI, pemustaka_id, collection_id, repositoryDeb]);

  useEffect(() => {
    if (document.body !== 'undefined') {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleSearchInputChange = (inputValue) => {
    setSearchRepository(inputValue);
  };

  const handleRepositoryChange = (option) => {
    setSelectedOption(option);
    onRepositoryChange(option ?? '');
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
        }),
        menuPortal: (provided, state) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
      placeholder="Pilih Karya Tulis Ilmiah"
      noOptionsMessage={() => 'Karya tulis ilmiah tidak ditemukan'}
      options={repositories}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleRepositoryChange}
      isLoading={loading}
      loadingMessage={() => 'Memuat . . .'}
      menuPortalTarget={menuPortalTarget}
      isClearable
      isDisabled={!pemustaka_id || !collection_id}
    />
  );
};

export default SelectRepository;
