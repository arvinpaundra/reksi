import Link from 'next/link';
import { HiHome } from 'react-icons/hi';
import { IoPerson } from 'react-icons/io5';
import { TbSearch } from 'react-icons/tb';

const NavbarMobile = ({ authenticated, active }) => {
  return (
    <nav
      className={`lg:hidden grid z-20 grid-cols-3 justify-between items-center fixed bottom-0 left-0 py-2 bg-white w-full`}
    >
      <Link href="/">
        <a className="flex flex-col items-center justify-center gap-0.5">
          <HiHome size={20} color={active === 'beranda' ? '#F66951' : '7C7C7C'} />
          <p
            className={`text-sm font-medium ${
              active === 'beranda' ? 'text-black' : 'text-secondary'
            }`}
          >
            Beranda
          </p>
        </a>
      </Link>
      <Link href="/repositori">
        <a className="flex flex-col items-center justify-center gap-0.5">
          <TbSearch size={20} color={active === 'cari' ? '#F66951' : '7C7C7C'} />
          <p
            className={`text-sm font-medium ${active === 'cari' ? 'text-black' : 'text-secondary'}`}
          >
            Cari
          </p>
        </a>
      </Link>
      <Link href={`${authenticated ? '/mahasiswa/profil' : '/auth/masuk'}`}>
        <a className="flex flex-col items-center justify-center gap-0.5">
          <IoPerson size={20} color={active === 'akunku' ? '#F66951' : '7C7C7C'} />
          <p
            className={`text-sm font-medium ${
              active === 'akunku' ? 'text-black' : 'text-secondary'
            }`}
          >
            Profil
          </p>
        </a>
      </Link>
    </nav>
  );
};

export default NavbarMobile;
