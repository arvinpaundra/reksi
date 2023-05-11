const Badge = (props) => {
  const { textColor, borderColor, children } = props;

  return (
    <div className={`border px-3 rounded-full w-fit ${borderColor}`}>
      <p className={`font-medium text-xs ${textColor}`}>{children}</p>
    </div>
  );
};

export default Badge;
