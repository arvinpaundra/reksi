const CircularBadge = ({ value, textColor, bgColor }) => {
  return (
    <div className={`rounded-full w-5 h-5 flex items-center justify-center ${bgColor}`}>
      <p className={`text-xs ${textColor}`}>{value}</p>
    </div>
  );
};

export default CircularBadge;
