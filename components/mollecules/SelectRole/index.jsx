import { Listbox } from '@headlessui/react';
import { useCallback, useEffect, useState } from 'react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { getAllRoles } from '../../../services/role';

const SelectRole = (props) => {
  const { error, role, setRole } = props;

  const [dataRoles, setDataRoles] = useState([]);

  const getAllRoleAPI = useCallback(async () => {
    try {
      const response = await getAllRoles('pemustaka');

      setDataRoles(response?.data);
    } catch (err) {}
  }, []);

  const roleName = dataRoles?.filter((data) => role?.id === data.id);

  useEffect(() => {
    getAllRoleAPI();
  }, [getAllRoleAPI]);

  return (
    <Listbox value={role} onChange={(event) => setRole({ name: event.role, id: event.id })}>
      <div className="relative">
        <Listbox.Button
          className={`relative w-full border ${
            error ? 'border-red' : 'border-black/50'
          } text-start rounded-xl py-2 px-4 outline-none focus:border-blue`}
        >
          {roleName?.length ? (
            <span className="block truncate">{roleName[0]?.role}</span>
          ) : (
            <span className="text-secondary">Pilih Role</span>
          )}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 shadow-md focus:outline-none">
          {dataRoles?.length ? (
            dataRoles?.map((data) => (
              <Listbox.Option
                key={data.id}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 px-4 ${
                    active ? 'bg-green/10 text-black' : 'text-secondary'
                  }`
                }
                value={data}
              >
                {data.role}
              </Listbox.Option>
            ))
          ) : (
            <Listbox.Option
              className={
                'relative cursor-default select-none py-2 px-4 bg-green/10 text-black text-center'
              }
              value={''}
            >
              Data tidak ditemukan.
            </Listbox.Option>
          )}
        </Listbox.Options>
      </div>
    </Listbox>
  );
};

export default SelectRole;
