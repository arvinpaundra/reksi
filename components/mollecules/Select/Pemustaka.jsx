import DropdownIndicator from '../../atoms/DropdownIndicator';
import { useCallback, useEffect, useState } from 'react';
import useDebounce from '../../../hooks/use-debounce';
import { getAllPemustaka } from '../../../services/pemustaka';
import Select from 'react-select';
import { ROLE_DOSEN_ID, ROLE_MAHASISWA_ID } from '../../../constants';

const SelectPemustaka = ({ index, onPemustakaChange, role = '', error, defaultValue }) => {
  const [loading, setLoading] = useState(null);

  const [selectedOption, setSelectedOption] = useState();
  const [pemustaka, setPemustaka] = useState([]);
  const [searchPemustaka, setSearchPemustaka] = useState('');
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const pemustakaDeb = useDebounce(searchPemustaka, 500);

  const getAllPemustakaAPI = useCallback(
    async (keyword) => {
      try {
        setLoading(true);
        if (role === 'dosen') {
          const response = await getAllPemustaka(keyword, ROLE_DOSEN_ID, '', '', '', '', 5, 0);

          const transformedResponses = response?.data?.map((item) => ({
            value: item.id,
            label: item.fullname,
            role: item.role,
            departement: item.departement,
          }));

          setPemustaka(transformedResponses);
        } else if (role === 'mahasiswa') {
          const response = await getAllPemustaka(keyword, ROLE_MAHASISWA_ID, '', '', '', '', 5, 0);

          const transformedResponses = response?.data?.map((item) => ({
            value: item.id,
            label: item.fullname,
            role: item.role,
            departement: item.departement,
          }));

          setPemustaka(transformedResponses);
        } else {
          const response = await getAllPemustaka(keyword, '', '', '', '', '', 5, 0);

          const transformedResponses = response?.data?.map((item) => ({
            value: item.id,
            label: item.fullname,
            role: item.role,
            departement: item.departement,
          }));

          setPemustaka(transformedResponses);
        }
      } catch (err) {
      } finally {
        setLoading(false);
      }
    },
    [role],
  );

  useEffect(() => {
    getAllPemustakaAPI(pemustakaDeb);
    setMenuPortalTarget(document.body);
  }, [getAllPemustakaAPI, pemustakaDeb]);

  useEffect(() => {
    if (document.body !== 'undefined') {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleSearchInputChange = (inputValue) => {
    setSearchPemustaka(inputValue);
  };

  const handlePemustakaChange = (option) => {
    setSelectedOption(option);
    onPemustakaChange(index, option ?? '');
  };

  const formatOptionLabel = ({ label, role, departement }) => (
    <CustomOption label={label} role={role} departement={departement} />
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
        }),
        menuPortal: (provided, staate) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
      placeholder="Pilih Pemustaka"
      noOptionsMessage={() => 'Pemustaka tidak ditemukan'}
      options={pemustaka}
      onInputChange={handleSearchInputChange}
      isSearchable
      value={selectedOption}
      onChange={handlePemustakaChange}
      isLoading={loading}
      menuPortalTarget={menuPortalTarget}
      loadingMessage={() => 'Memuat . . .'}
      isClearable
    />
  );
};

export default SelectPemustaka;

const CustomOption = ({ label, role, departement }) => {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-base font-medium">{label}</p>
      {role && departement && (
        <p className="text-sm text-secondary">
          {role} - {departement}
        </p>
      )}
    </div>
  );
};
