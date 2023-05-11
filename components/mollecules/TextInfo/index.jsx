import Link from 'next/link';

const TextInfo = (props) => {
  const { label, value, href } = props;

  if (href) {
    return (
      <div className="text-ellipsis">
        <p className="text-sm text-secondary mb-0.5">{label}</p>
        <Link href={href}>
          <a target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-secondary mb-0.5">{label}</p>
      <p>{value}</p>
    </div>
  );
};

export default TextInfo;
