import { ToastContainer } from 'react-toastify';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-modern-drawer/dist/index.css';

const contextToastClass = {
  success: 'bg-green',
  error: 'bg-red',
  info: 'bg-blue',
  warning: 'bg-orange',
};

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ToastContainer
        toastClassName={({ type }) =>
          contextToastClass[type || 'default'] +
          ' relative flex mb-20 mx-4 sm:m-0 p-1 min-h-10 rounded-lg justify-between overflow-hidden cursor-pointer'
        }
        theme="colored"
        autoClose={3000}
        position="top-right"
      />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
