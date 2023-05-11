const CardHeader = (props) => {
  const { className, children } = props;

  return <div className={className}>{children}</div>;
};

export default CardHeader;
