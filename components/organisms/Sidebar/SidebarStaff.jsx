/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import Link from 'next/link';
import { IoPerson } from 'react-icons/io5';
import Divider from '../../atoms/Divider';
import { MdLogout, MdOutlinePassword } from 'react-icons/md';
import { BsGridFill, BsPersonCheckFill, BsDot } from 'react-icons/bs';
import { FaBook, FaFolderOpen, FaSignature } from 'react-icons/fa';
import { BiChevronDown, BiChevronUp } from 'react-icons/bi';
import { getDetailStaff } from '../../../services/staff';
import { useCallback, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import CircularBadge from '../../atoms/Badge/Circular';
import { getTotalRequestAccess } from '../../../services/request_access';
import { getTotalRepositories } from '../../../services/repository';
import { HiDocumentText } from 'react-icons/hi';
import jwtDecode from 'jwt-decode';

const SidebarStaff = ({ data, role }) => {
  const [user, setUser] = useState({
    name: '',
    role: '',
    avatar: 'https://res.cloudinary.com/dxhv9xlwc/image/upload/v1676344916/avatars/avatar.png',
  });
  const [totalRequestAccess, setTotalRequestAccess] = useState(0);
  const [totalPendingRepositories, setTotalPendingRepositories] = useState(0);
  const [loading, setLoading] = useState(null);
  const [expandDataMaster, setExpandDataMaster] = useState(true);
  const [expandReport, setExpandReport] = useState(true);

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

  const { id: staff_id } = data;

  useEffect(() => {
    getDetailStaffAPI(staff_id);
  }, [getDetailStaffAPI, staff_id]);

  const getTotalRequestAccessAPI = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getTotalRequestAccess('pending');

      const total = response?.data?.total;

      setTotalRequestAccess(total > 9 ? '9+' : total);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get('token');

    if (token) {
      const payloads = jwtDecode(token);

      if (payloads?.role === 'Administrator' || payloads?.role === 'Pustakawan') {
        getTotalRequestAccessAPI();
      }
    }
  }, [getTotalRequestAccessAPI]);

  const getTotalPendingRepositoriesAPI = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getTotalRepositories('pending');

      setTotalPendingRepositories(response?.data?.total_repositories);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getTotalPendingRepositoriesAPI();
  }, [getTotalPendingRepositoriesAPI]);

  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');

    router.push('/auth/masuk');
  };

  switch (role) {
    case 'administrator':
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
                </div>
              </CardBody>
            </Card>

            <Card className="rounded-lg overflow-hidden">
              <CardBody className="w-full bg-white flex flex-col text-sm font-medium">
                <Link href="/administrator/dashboard">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <BsGridFill size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Dashboard</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/administrator/profil">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <IoPerson size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Profil</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/administrator/permintaan-akses">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 p-4">
                        <BsPersonCheckFill size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Permintaan Akses</p>
                      </div>

                      <CircularBadge
                        bgColor={'bg-red/80'}
                        textColor={'text-white'}
                        value={totalRequestAccess}
                      />
                    </div>

                    <Divider />
                  </a>
                </Link>
                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandDataMaster((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFolderOpen size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Data Master</p>
                      </div>

                      {expandDataMaster ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandDataMaster && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/administrator/pemustaka">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Pemustaka</a>
                      </Link>
                      <Link href="/administrator/petugas">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Petugas</a>
                      </Link>
                      <Link href="/administrator/repositori">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                          <div className="flex items-center">
                            <p className="text-sm 2xl:text-base font-normal">Repositori</p>

                            {totalPendingRepositories > 0 && (
                              <BsDot size={30} color="D94555" title="Repositori pending baru" />
                            )}
                          </div>
                        </a>
                      </Link>
                      <Link href="/administrator/jurusan">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Jurusan</a>
                      </Link>
                      <Link href="/administrator/program-studi">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Program Studi</a>
                      </Link>
                      <Link href="/administrator/koleksi">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Koleksi</a>
                      </Link>
                      <Link href="/administrator/kategori">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Kategori</a>
                      </Link>
                      <Link href="/administrator/role">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Role</a>
                      </Link>
                    </div>
                  )}

                  <Divider />
                </div>

                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandReport((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HiDocumentText size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Report</p>
                      </div>

                      {expandReport ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandReport && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/administrator/report/surat-keterangan-penyerahan-laporan">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                          Surat Keterangan Penyerahan Laporan
                        </a>
                      </Link>
                      <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                        <Link href="/administrator/report/rekap-pengumpulan-laporan">
                          <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                            Rekap Pengumpulan Laporan
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}

                  <Divider />
                </div>

                <Link href="/administrator/tandatangan">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <FaSignature size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Unggah Tandatangan</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/administrator/ganti-sandi">
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

    case 'pustakawan':
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
                </div>
              </CardBody>
            </Card>

            <Card className="rounded-lg overflow-hidden">
              <CardBody className="w-full bg-white flex flex-col text-sm font-medium">
                <Link href="/pustakawan/dashboard">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <BsGridFill size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Dashboard</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/pustakawan/profil">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <IoPerson size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Profil</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/pustakawan/permintaan-akses">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center">
                      <div className="flex items-center gap-3 p-4">
                        <BsPersonCheckFill size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Permintaan Akses</p>
                      </div>

                      <CircularBadge
                        bgColor={'bg-red/80'}
                        textColor={'text-white'}
                        value={totalRequestAccess}
                      />
                    </div>

                    <Divider />
                  </a>
                </Link>
                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandDataMaster((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFolderOpen size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Data Master</p>
                      </div>

                      {expandDataMaster ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandDataMaster && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/pustakawan/pemustaka">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Pemustaka</a>
                      </Link>
                      <Link href="/pustakawan/repositori">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                          <div className="flex items-center">
                            <p className="text-sm 2xl:text-base font-normal">Repositori</p>

                            {totalPendingRepositories > 0 && (
                              <BsDot size={30} color="D94555" title="Repositori pending baru" />
                            )}
                          </div>
                        </a>
                      </Link>
                      <Link href="/pustakawan/koleksi">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Koleksi</a>
                      </Link>
                      <Link href="/pustakawan/kategori">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Kategori</a>
                      </Link>
                    </div>
                  )}

                  <Divider />
                </div>
                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandReport((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HiDocumentText size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Report</p>
                      </div>

                      {expandReport ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandReport && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/pustakawan/report/surat-keterangan-penyerahan-laporan">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                          Surat Keterangan Penyerahan Laporan
                        </a>
                      </Link>
                      <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                        <Link href="/pustakawan/report/rekap-pengumpulan-laporan">
                          <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                            Rekap Pengumpulan Laporan
                          </a>
                        </Link>
                      </div>
                    </div>
                  )}

                  <Divider />
                </div>

                <Link href="/pustakawan/tandatangan">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <FaSignature size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Unggah Tandatangan</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/pustakawan/ganti-sandi">
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

    default:
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
                </div>
              </CardBody>
            </Card>

            <Card className="rounded-lg overflow-hidden">
              <CardBody className="w-full bg-white flex flex-col text-sm font-medium">
                <Link href="/kepala-perpustakaan/dashboard">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <BsGridFill size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Dashboard</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/kepala-perpustakaan/profil">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <IoPerson size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Profil</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandDataMaster((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFolderOpen size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Data Master</p>
                      </div>

                      {expandDataMaster ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandDataMaster && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/kepala-perpustakaan/pemustaka">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Pemustaka</a>
                      </Link>
                      <Link href="/kepala-perpustakaan/petugas">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Petugas</a>
                      </Link>
                      <Link href="/kepala-perpustakaan/repositori">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">
                          <div className="flex items-center">
                            <p className="text-sm 2xl:text-base font-normal">Repositori</p>

                            {totalPendingRepositories > 0 && (
                              <BsDot size={30} color="D94555" title="Repositori pending baru" />
                            )}
                          </div>
                        </a>
                      </Link>
                    </div>
                  )}

                  <Divider />
                </div>
                <div className="flex flex-col w-full">
                  <button
                    className="hover:bg-blue/5 p-4"
                    onClick={() => setExpandReport((prevState) => !prevState)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HiDocumentText size={20} />
                        <p className="text-sm 2xl:text-base font-normal">Report</p>
                      </div>

                      {expandReport ? <BiChevronUp size={20} /> : <BiChevronDown size={20} />}
                    </div>
                  </button>

                  {expandReport && (
                    <div className="duration-75 flex flex-col text-sm 2xl:text-base font-normal">
                      <Link href="/kepala-perpustakaan/report/rekap-pengumpulan-laporan">
                        <a className="py-3 pl-12 pr-3 hover:bg-blue/5">Rekap Pengumpulan Laporan</a>
                      </Link>
                    </div>
                  )}

                  <Divider />
                </div>
                <Link href="/kepala-perpustakaan/tandatangan">
                  <a className="hover:bg-blue/5">
                    <div className="flex items-center gap-3 p-4">
                      <FaSignature size={20} />
                      <p className="text-sm 2xl:text-base font-normal">Unggah Tandatangan</p>
                    </div>

                    <Divider />
                  </a>
                </Link>
                <Link href="/kepala-perpustakaan/ganti-sandi">
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
  }
};

export default SidebarStaff;
