import { useCallback, useEffect, useState } from 'react';
import { getStudyProgramsByDepartement } from '../../../services/study_program';
import DropdownIndicator from '../../atoms/DropdownIndicator';
import Select from 'react-select';

const SelectProdi = ({ onProdiChange, error, departement_id, defaultValue = null }) => {
  const [prodi, setProdi] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const getProdiAPI = useCallback(async (departement_id) => {
    try {
      const response = await getStudyProgramsByDepartement(departement_id);

      const transformedData = response?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      }));

      setProdi(transformedData);
    } catch (err) {}
  }, []);

  const getDefaultValue = useCallback(async (defaultValue, departement_id) => {
    try {
      const defaultProdi = await getStudyProgramsByDepartement(departement_id);
      const defaultLabelProdi = defaultProdi?.data
        ?.map((item) => ({
          value: item.id,
          label: item.name,
        }))
        .filter((prodi) => prodi?.label?.toLowerCase()?.includes(defaultValue?.toLowerCase()));

      setSelectedOption(defaultLabelProdi);
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (departement_id) {
      getProdiAPI(departement_id);
    }
    setMenuPortalTarget(document.body);
  }, [getProdiAPI, departement_id]);

  useEffect(() => {
    if (departement_id && defaultValue) {
      getDefaultValue(defaultValue, departement_id);
    }
  }, [getDefaultValue, defaultValue, departement_id]);

  useEffect(() => {
    if (document.body !== 'undefined') {
      setMenuPortalTarget(document.body);
    }
  }, []);

  const handleProdiChange = (option) => {
    setSelectedOption(option);
    onProdiChange(option ?? '');
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
        menuPortal: (provided, staate) => ({
          ...provided,
          zIndex: 9999,
        }),
      }}
      placeholder="Pilih Program Studi"
      noOptionsMessage={() => 'Program Studi tidak ditemukan'}
      options={prodi}
      isSearchable={false}
      value={selectedOption}
      onChange={handleProdiChange}
      menuPortalTarget={menuPortalTarget}
      isClearable
    />
  );
};

export default SelectProdi;
