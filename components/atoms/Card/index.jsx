const Card = (props) => {
  const { className, children } = props;

  return <section className={className}>{children}</section>;
};

export default Card;
