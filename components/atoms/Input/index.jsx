import { IoClose } from 'react-icons/io5';

export const Input = (props) => {
  const { error, type, placeholder } = props;

  return (
    <input
      className={`border ${
        error ? 'border-red' : 'border-black/50'
      } rounded-xl py-2 px-4 outline-none focus:border-blue w-full`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
};

export const InputFile = ({ file, setFile, target, accept, error }) => {
  return (
    <>
      <input
        type="file"
        accept={accept}
        id={target}
        className="hidden"
        onChange={(event) => setFile(event.target.files[0])}
      />
      <div
        className={`w-full border-dashed ${
          error ? 'border-red' : 'border-black/50'
        } border-2 p-2 flex items-center justify-center rounded-xl`}
      >
        {file ? (
          <div className="w-full flex flex-col gap-1 overflow-clip">
            <p className="">{file?.name}</p>
            <button
              onClick={() => setFile(null)}
              className="flex items-center self-end px-4 py-1 hover:bg-red/10 rounded-lg"
            >
              <IoClose size={18} className="text-red" />
              <p>Hapus</p>
            </button>
          </div>
        ) : (
          <label
            className={`p-2 w-32 lg:w-40 2xl:w-48 text-white text-center font-medium rounded-xl bg-blue/80 hover:bg-blue cursor-pointer`}
            htmlFor={target}
          >
            Pilih file
          </label>
        )}
      </div>
    </>
  );
};
