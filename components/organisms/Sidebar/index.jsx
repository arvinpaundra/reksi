/* eslint-disable @next/next/no-img-element */
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { BsFileEarmarkPdfFill } from 'react-icons/bs';
import { FaBook } from 'react-icons/fa';
import { IoPerson } from 'react-icons/io5';
import { MdLogout, MdOutlinePassword } from 'react-icons/md';
import { getDetailPemustaka } from '../../../services/pemustaka';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import Divider from '../../atoms/Divider';
import { HiDocumentText } from 'react-icons/hi';

const Sidebar = (props) => {
  const { data, role } = props;

  const [user, setUser] = useState({
    name: '',
    role: '',
    departement: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });
  const [loading, setLoading] = useState(null);

  const getDetailPemustakaAPI = useCallback(async (pemustaka_id) => {
    try {
      setLoading(true);
      const response = await getDetailPemustaka(pemustaka_id);

      setUser(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const { id: pemustaka_id } = data;

  useEffect(() => {
    getDetailPemustakaAPI(pemustaka_id);
  }, [getDetailPemustakaAPI, pemustaka_id]);

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');

    router.push('/auth/masuk');
  };

  return (
    <aside className="hidden xl:block xl:col-span-3 h-full">
      <div className="sticky top-0 xl:flex xl:flex-col xl:gap-4">
        <Card className="rounded-lg overflow-hidden">
          <CardBody className="w-full bg-white p-4 text-sm font-medium flex items-center gap-4">
            <img
              src={user?.avatar}
              alt=""
              className="w-16 h-16 rounded-full object-cover flex-shrink-0 self-start"
            />
            <div className="">
              <h3 className="font-medium text-base">{user?.fullname}</h3>
              <p className="text-secondary text-sm font-normal">{user?.role}</p>
              <p className="text-secondary text-sm font-normal">{user?.departement}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="rounded-lg overflow-hidden">
          <CardBody className="w-full bg-white flex flex-col text-sm font-medium">
            <Link href={role === 'dosen' ? '/dosen/profil' : '/mahasiswa/profil'}>
              <a className="hover:bg-blue/5">
                <div className="flex items-center gap-3 p-4">
                  <IoPerson size={20} />
                  <p className="text-sm 2xl:text-base font-normal">Profil</p>
                </div>

                <Divider />
              </a>
            </Link>
            <Link href={role === 'dosen' ? '/dosen/e-perpus' : '/mahasiswa/e-perpus'}>
              <a className="hover:bg-blue/5">
                <div className="flex items-center gap-3 p-4">
                  <BsFileEarmarkPdfFill size={20} />
                  <p className="text-sm 2xl:text-base font-normal">Kartu E-Perpus</p>
                </div>

                <Divider />
              </a>
            </Link>
            <Link href={role === 'dosen' ? '/dosen/repositori' : '/mahasiswa/repositori'}>
              <a className="hover:bg-blue/5">
                <div className="flex items-center gap-3 p-4">
                  <FaBook size={20} />
                  <p className="text-sm 2xl:text-base font-normal">Repositori</p>
                </div>

                <Divider />
              </a>
            </Link>
            <Link
              href={
                role === 'dosen'
                  ? '/dosen/surat-keterangan-penyerahan-laporan'
                  : '/mahasiswa/surat-keterangan-penyerahan-laporan'
              }
            >
              <a className="hover:bg-blue/5">
                <div className="flex items-center gap-3 p-4">
                  <HiDocumentText size={26} />
                  <p className="text-sm 2xl:text-base font-normal">Cetak Surat Keterangan</p>
                </div>
                <Divider />
              </a>
            </Link>
            <Link href={role === 'dosen' ? '/dosen/ganti-sandi' : '/mahasiswa/ganti-sandi'}>
              <a className="hover:bg-blue/5">
                <div className="flex items-center gap-3 p-4">
                  <MdOutlinePassword size={20} />
                  <p className="text-sm 2xl:text-base font-normal">Ganti Kata Sandi</p>
                </div>

                <Divider />
              </a>
            </Link>
            <button className="hover:bg-blue/5" onClick={handleLogout}>
              <div className="flex items-center gap-3 p-4">
                <MdLogout size={20} />
                <p className="text-sm 2xl:text-base font-normal">Keluar</p>
              </div>
            </button>
          </CardBody>
        </Card>
      </div>
    </aside>
  );
};

export default Sidebar;
