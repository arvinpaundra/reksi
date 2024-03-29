import { useCallback, useEffect, useState } from 'react';
import { getAllRoles } from '../../../services/role';
import DropdownIndicator from '../../atoms/DropdownIndicator';
import Select from 'react-select';

const SelectRole = ({ error, onRoleChange, visibility = '', defaultValue = null }) => {
  const [roles, setRoles] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const [menuPortalTarget, setMenuPortalTarget] = useState(null);

  const getAllRoleAPI = useCallback(async (visibility) => {
    try {
      const response = await getAllRoles(visibility);

      const transformedData = response?.data.map((item) => ({
        value: item.id,
        label: item.role,
      }));

      setRoles(transformedData);
    } catch (err) {}
  }, []);

  const getDefaultValue = useCallback(async (defaultValue) => {
    try {
      const defaultRole = await getAllRoles('');
      const defaultLabelRole = defaultRole?.data
        ?.map((item) => ({
          value: item.id,
          label: item.role,
        }))
        .filter((role) => role?.label?.toLowerCase()?.includes(defaultValue?.toLowerCase()));

      setSelectedOption(defaultLabelRole);
    } catch (error) {}
  }, []);

  useEffect(() => {
    getAllRoleAPI(visibility);
    setMenuPortalTarget(document.body);
  }, [getAllRoleAPI, visibility]);

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

  const handleRoleChange = (option) => {
    setSelectedOption(option);
    onRoleChange(option ?? '');
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
      placeholder="Pilih Role"
      noOptionsMessage={() => 'Role tidak ditemukan'}
      options={roles}
      isSearchable={false}
      value={selectedOption}
      onChange={handleRoleChange}
      menuPortalTarget={menuPortalTarget}
      isClearable
    />
  );
};

export default SelectRole;
