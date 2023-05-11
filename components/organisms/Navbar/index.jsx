/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { getDetailPemustaka } from '../../../services/pemustaka';
import NavbarMobile from './NavbarMobile';
import { NavbarBadgeMenu, NavbarBadge } from './NavbarBadge';
import { getDetailStaff } from '../../../services/staff';

const Navbar = ({ active }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const [loading, setLoading] = useState(null);
  const [user, setUser] = useState({
    role: '',
    study_program: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(pemustaka_id);

      setUser(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const getDetailStaffAPI = useCallback(async (staff_id) => {
    try {
      setLoading(true);

      const response = await getDetailStaff(staff_id);

      setUser(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      setAuthenticated(true);
      const payloads = jwtDecode(token);

      const { id } = payloads;

      if (payloads?.role === 'Dosen' || payloads?.role === 'Mahasiswa') {
        getDetailPemustakaAPI(id);
      } else {
        getDetailStaffAPI(id);
      }
    }
  }, [getDetailPemustakaAPI, getDetailStaffAPI]);

  return (
    <>
      <header className="hidden w-full lg:flex items-center justify-between p-4 md:py-4 md:px-12 lg:py-4 lg:px-24 2xl:px-[15%] bg-grayish-blue">
        <Link href="/">
          <a>
            <img src="/images/logo-pnc.png" alt="Logo PNC" className="w-32" />
          </a>
        </Link>

        <ul className="hidden lg:flex items-center justify-center gap-8">
          <li>
            <Link href="/">
              <a className="font-medium text-white">Beranda</a>
            </Link>
          </li>
          <li>
            <Link href="/repositori">
              <a className="font-medium text-white">Cari</a>
            </Link>
          </li>
          <li>
            <NavbarBadge setIsOpen={setIsOpen} authenticated={authenticated} user={user} />
          </li>
        </ul>
      </header>

      <NavbarMobile authenticated={authenticated} active={active} />

      <NavbarBadgeMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;
