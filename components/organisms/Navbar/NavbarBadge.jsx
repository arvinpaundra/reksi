/* eslint-disable @next/next/no-img-element */
import { Dialog } from '@headlessui/react';
import Link from 'next/link';
import Divider from '../../atoms/Divider';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { IoMenu } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

export const NavbarBadge = ({ setIsOpen, authenticated, user }) => {
  return (
    <>
      {authenticated ? (
        <div
          onClick={() => setIsOpen((prevState) => !prevState)}
          className="p-2 rounded-full overflow-hidden flex items-center justify-center gap-2 bg-white cursor-pointer"
        >
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src={user?.avatar} alt="Profile Picture" className="object-cover" />
          </div>
          <div>
            <IoMenu size={20} color="black" />
          </div>
        </div>
      ) : (
        <Link href="/auth/masuk">
          <a className="py-2 px-4 font-medium text-sm rounded-full overflow-hidden flex items-center justify-center gap-2 bg-white cursor-pointer">
            Masuk
          </a>
        </Link>
      )}
    </>
  );
};

export const NavbarBadgeMenu = ({ isOpen, setIsOpen }) => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const payloads = jwtDecode(token);

      setRole(payloads?.role);
    }
  }, []);

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');

    router.push('/auth/masuk');
  };

  switch (role) {
    case 'Dosen':
      return (
        <Dialog
          className="relative z-20 hidden lg:block"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/10" aria-hidden="true" />

          <Dialog.Panel className="fixed lg:right-28 lg:top-24 2xl:right-[15%] w-72 bg-white rounded-xl shadow-sm">
            <Link href="/dosen/profil/">
              <a className="outline-none w-full">
                <div className="p-5 font-medium ">
                  <p>Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button
              className="p-5 outline-none font-light w-full text-start"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </Dialog.Panel>
        </Dialog>
      );

    case 'Administrator':
      return (
        <Dialog
          className="relative z-20 hidden lg:block"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/10" aria-hidden="true" />

          <Dialog.Panel className="fixed lg:right-28 lg:top-24 2xl:right-[15%] w-72 bg-white rounded-xl shadow-sm">
            <Link href="/administrator/profil/">
              <a className="outline-none w-full">
                <div className="p-5 font-medium ">
                  <p>Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button
              className="p-5 outline-none font-light w-full text-start"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </Dialog.Panel>
        </Dialog>
      );

    case 'Pustakawan':
      return (
        <Dialog
          className="relative z-20 hidden lg:block"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/10" aria-hidden="true" />

          <Dialog.Panel className="fixed lg:right-28 lg:top-24 2xl:right-[15%] w-72 bg-white rounded-xl shadow-sm">
            <Link href="/pustakawan/profil/">
              <a className="outline-none w-full">
                <div className="p-5 font-medium ">
                  <p>Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button
              className="p-5 outline-none font-light w-full text-start"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </Dialog.Panel>
        </Dialog>
      );

    case 'Kepala Perpustakaan':
      return (
        <Dialog
          className="relative z-20 hidden lg:block"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/10" aria-hidden="true" />

          <Dialog.Panel className="fixed lg:right-28 lg:top-24 2xl:right-[15%] w-72 bg-white rounded-xl shadow-sm">
            <Link href="/kepala-perpustakaan/profil/">
              <a className="outline-none w-full">
                <div className="p-5 font-medium ">
                  <p>Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button
              className="p-5 outline-none font-light w-full text-start"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </Dialog.Panel>
        </Dialog>
      );

    default:
      return (
        <Dialog
          className="relative z-20 hidden lg:block"
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <div className="fixed inset-0 bg-black/10" aria-hidden="true" />

          <Dialog.Panel className="fixed lg:right-28 lg:top-24 2xl:right-[15%] w-72 bg-white rounded-xl shadow-sm">
            <Link href="/mahasiswa/profil/">
              <a className="outline-none w-full">
                <div className="p-5 font-medium ">
                  <p>Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button
              className="p-5 outline-none font-light w-full text-start"
              onClick={handleLogout}
            >
              Keluar
            </button>
          </Dialog.Panel>
        </Dialog>
      );
  }
};
