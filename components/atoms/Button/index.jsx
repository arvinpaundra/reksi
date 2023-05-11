export const ButtonFilled = (props) => {
  const { bgcolor, children, disabled } = props;

  return (
    <button
      className={`p-2 w-40 lg:w-40 2xl:w-48 text-white font-medium rounded-xl ${bgcolor} disabled:pointer-events-none`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
