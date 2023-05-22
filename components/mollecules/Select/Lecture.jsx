import { useState, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { getAllPemustaka } from '../../../services/pemustaka';
import { ROLE_DOSEN_ID } from '../../../constants';
import DropdownIndicator from '../../atoms/DropdownIndicator';
import useDebounce from '../../../hooks/use-debounce';

const SelectLecture = ({ error, onLectureChange }) => {
  const [selectedOption, setSelectedOption] = useState();
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(null);
  const [search, setSearch] = useState('');

  const lecturerDeb = useDebounce(search, 500);
  const getLecturersAPI = useCallback(async (keyword) => {
    try {
      setLoading(true);
      const response = await getAllPemustaka(keyword, ROLE_DOSEN_ID, '', '', '', 5, 0);

      const transformedResponses = response?.data?.map((item) => ({
        value: item.id,
        label: item.fullname,
        identity_number: item.identity_number,
        departement: item.departement,
      }));

      setLecturers(transformedResponses);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLecturersAPI(lecturerDeb);
  }, [getLecturersAPI, lecturerDeb]);

  const handleSearchInputChange = (inputValue) => {
    setSearch(inputValue);
  };

  const handleLecturerChange = (option) => {
    setSelectedOption(option);
    onLectureChange(option ?? '');
  };

  const formatOptionLabel = ({ label, identity_number, departement }) => (
    <CustomOption label={label} identity_number={identity_number} departement={departement} />
  );

  return (
    <Select
      className="w-full"
      components={{ DropdownIndicator }}
      formatOptionLabel={formatOptionLabel}
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
      }}
      placeholder="Pilih Dosen"
      noOptionsMessage={() => 'Dosen tidak ditemukan'}
      options={lecturers}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handleLecturerChange}
      isLoading={loading}
      loadingMessage={() => 'Memuat . . .'}
      menuPlacement="auto"
      isClearable
    />
  );
};

export default SelectLecture;

const CustomOption = ({ label, identity_number, departement }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base font-medium">{label}</p>
      {identity_number && departement && (
        <p className="text-sm text-secondary">
          {identity_number} - {departement}
        </p>
      )}
    </div>
  );
};
