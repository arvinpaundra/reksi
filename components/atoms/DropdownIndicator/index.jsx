import { RiArrowDropDownLine } from 'react-icons/ri';
import { components } from 'react-select';

const DropdownIndicator = (props) => {
  return (
    <components.DropdownIndicator {...props}>
      <div className="flex items-center justify-center p-1 cursor-pointer rounded-full hover:bg-blue/10">
        <RiArrowDropDownLine className="h-5 w-5 text-black" />
      </div>
    </components.DropdownIndicator>
  );
};

export default DropdownIndicator;
