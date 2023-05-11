import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getAllCollections } from '../../../services/collection';
import { getAllDepartements } from '../../../services/departement';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import { BiChevronRight } from 'react-icons/bi';

const SidemenuBeranda = (props) => {
  const [collections, setCollections] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(null);

  const getCollectionsAPI = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllCollections('', '', 5, 0);

      setCollections(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const getDepartementsAPI = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getAllDepartements('', 5, 0);

      setDepartements(response?.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getCollectionsAPI();
  }, [getCollectionsAPI]);

  useEffect(() => {
    getDepartementsAPI();
  }, [getDepartementsAPI]);

  return (
    <aside className="hidden xl:flex xl:flex-col gap-4 xl:col-span-3">
      <Card className="rounded-lg overflow-hidden">
        <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
          <Link href="/koleksi">
            <a>
              <div className="flex justify-between items-center">
                <h2 className="text-white text-lg md:text-xl">Koleksi</h2>
                <BiChevronRight color="white" size={20} />
              </div>
            </a>
          </Link>
        </CardHeader>

        <CardBody className="w-full bg-white flex flex-col gap-2 py-2 text-sm font-medium">
          {collections?.map((item, index) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <Link href={`/koleksi/${item.id}/repositori`}>
                <a>
                  <div className="hover:text-orange hover:transition hover:ease-in-out hover:duration-200 py-2 p-4">
                    {item.name}
                  </div>
                </a>
              </Link>

              {collections?.length - 1 != index && <Divider />}
            </div>
          ))}
        </CardBody>
      </Card>

      <Card className="rounded-lg overflow-hidden">
        <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
          <Link href="/jurusan">
            <a>
              <div className="flex justify-between items-center">
                <h2 className="text-white text-lg md:text-xl">Jurusan</h2>
                <BiChevronRight color="white" size={20} />
              </div>
            </a>
          </Link>
        </CardHeader>

        <CardBody className="w-full bg-white flex flex-col gap-2 py-2 text-sm font-medium">
          {departements?.map((item, index) => (
            <div className="flex flex-col gap-2" key={item.id}>
              <Link href={`/kategori/${item.id}/repositori`}>
                <a>
                  <div className="hover:text-orange hover:transition hover:ease-in-out hover:duration-200 py-2 p-4">
                    {item.name}
                  </div>
                </a>
              </Link>

              {departements?.length - 1 != index && <Divider />}
            </div>
          ))}
        </CardBody>
      </Card>
    </aside>
  );
};

export default SidemenuBeranda;
