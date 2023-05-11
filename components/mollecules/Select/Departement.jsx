import { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../../hooks/use-debounce';
import { getAllDepartements } from '../../../services/departement';
import DropdownIndicator from '../../atoms/DropdownIndicator';
import Select from 'react-select';

const SelectDepartement = ({ onDepartementChange, error }) => {
  const [loading, setLoading] = useState(null);

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

  useEffect(() => {
    getAllDepartementsAPI(departementDeb);
    setMenuPortalTarget(document.body);
  }, [getAllDepartementsAPI, departementDeb]);

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
      }}
      placeholder="Pilih Jurusan"
      noOptionsMessage={() => 'Jurusan tidak ditemukan'}
      options={departements}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleDepartementChange}
      isLoading={loading}
      loadingMessage={() => 'Memuat . . .'}
      isClearable
    />
  );
};

export default SelectDepartement;
