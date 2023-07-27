import { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../../hooks/use-debounce';
import { getAllDepartements } from '../../../services/departement';
import DropdownIndicator from '../../atoms/DropdownIndicator';
import Select from 'react-select';

const SelectDepartement = ({ onDepartementChange, error, defaultValue = null }) => {
  const [loading, setLoading] = useState(false);
  const [loadingDefault, setLoadingDefault] = useState(false);

  const [selectedOption, setSelectedOption] = useState();
  const [departements, setDepartements] = useState([]);
  const [searchDepartement, setSearchDepartement] = useState('');
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const departementDeb = useDebounce(searchDepartement, 500);

  const getAllDepartementsAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await getAllDepartements(keyword, 5, 0);

      const transformedResponses = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setDepartements(transformedResponses);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const getDefaultValue = useCallback(async (defaultValue) => {
    try {
      setLoadingDefault(true);

      const defaultDepartement = await getAllDepartements(defaultValue, 1, 0);
      const defaultLabelDepartement = defaultDepartement?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setSelectedOption(defaultLabelDepartement);
    } catch (error) {
    } finally {
      setLoadingDefault(false);
    }
  }, []);

  useEffect(() => {
    getAllDepartementsAPI(departementDeb);
  }, [getAllDepartementsAPI, departementDeb]);

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
    setSearchDepartement(inputValue);
  };

  const handleDepartementChange = (option) => {
    setSelectedOption(option);
    onDepartementChange(option ?? '');
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
          zIndex: 9999,
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
      placeholder="Pilih Jurusan"
      noOptionsMessage={() => 'Jurusan tidak ditemukan'}
      options={departements}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleDepartementChange}
      menuPortalTarget={menuPortalTarget}
      isLoading={loading || loadingDefault}
      loadingMessage={() => 'Memuat . . .'}
      isClearable
    />
  );
};

export default SelectDepartement;
