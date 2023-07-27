import { useContext, createContext, useState } from 'react';

const FetchUserContext = createContext({
  isFetching: true,
  updateFetchStatus: (status) => {},
});

export const useFetchUser = () => useContext(FetchUserContext);

export const FetchUserProvider = ({ children }) => {
  const [isFetching, setIsFetching] = useState(true);

  const updateFetchStatus = (status) => {
    setIsFetching(status);
  };

  return (
    <FetchUserContext.Provider
      value={{
        isFetching,
        updateFetchStatus,
      }}
    >
      {children}
    </FetchUserContext.Provider>
  );
};
