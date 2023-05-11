const { useState, useEffect } = require('react');

const useDebounce = (val, delay) => {
  const [debounceVal, setDebounceVal] = useState(val);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(val);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [val, delay]);

  return debounceVal;
};

export default useDebounce;
