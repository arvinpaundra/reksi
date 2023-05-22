/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { getAllRepositories } from '../../../services/repository';
import Badge from '../../atoms/Badge';
import Card from '../../atoms/Card';
import CardBody from '../../atoms/Card/CardBody';
import CardFooter from '../../atoms/Card/CardFooter';
import CardHeader from '../../atoms/Card/CardHeader';
import Divider from '../../atoms/Divider';
import Paginate from '../../mollecules/Pagination';
import { FormatDateIntl } from '../../../helper/format_date_intl';

const CardBeranda = (props) => {
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(null);

  const getAllRepositoriesAPI = useCallback(async (currPage) => {
    try {
      setLoading(true);
      const response = await getAllRepositories(
        '',
        '',
        '',
        '',
        '',
        'created_at DESC',
        'approved',
        10,
        currPage,
      );

      setRepositories(response?.data);
      setPages(response?.pagination?.total_pages);
      setCurrPage(response?.pagination?.page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getAllRepositoriesAPI(currPage);
  }, [getAllRepositoriesAPI, currPage]);

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  return (
    <Card className="w-full bg-white rounded-lg overflow-hidden h-fit xl:col-span-9">
      <CardHeader className="w-full border-l-4 border-grayish-blue bg-pastel-grey p-4 bg-lynch">
        <h2 className="text-white text-lg md:text-xl">Unggahan Terbaru</h2>
      </CardHeader>

      <CardBody className="w-full bg-white">
        {repositories?.length > 0 ? (
          repositories?.map((item) => (
            <Link href={`/repositori/${item.id}`} key={item.id}>
              <a>
                <div className="p-4 md:p-6 md:flex md:gap-4">
                  <img src="/images/Rectangle.png" alt="" className="hidden md:block w-24 h-32" />
                  <div>
                    <h3 className="text-base font-medium text-justify mb-1">{item.title}</h3>
                    {item.authors.map((author) => (
                      <p className="text-sm text-secondary" key={author.author_id}>
                        {author.fullname}
                      </p>
                    ))}
                    <p className="text-sm text-secondary my-2">
                      {FormatDateIntl(item.date_validated)}
                    </p>
                    <div className="flex items-center flex-wrap justify-start gap-2">
                      <Badge borderColor="border-green" textColor="text-green">
                        {item.collection}
                      </Badge>
                      <Badge borderColor="border-red" textColor="text-red">
                        {item.departement}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Divider />
              </a>
            </Link>
          ))
        ) : (
          <>
            <div className="p-4 md:px-6 lg:px-10 flex flex-col justify-center items-center gap-4">
              <img src="/images/empty-repository.png" alt="empty-repository" className="w-48" />
              <p className="p-4 md:px-6 lg:px-10 text-center">
                Karya tulis ilmiah tidak ditemukan.
              </p>
            </div>
          </>
        )}
      </CardBody>

      {repositories?.length > 0 && (
        <CardFooter className="p-4 flex flex-col items-center justify-center">
          <div className="pt-6 md:pt-6 pb-4 flex flex-col items-center justify-center">
            <Paginate pageChange={pageChange} pages={pages} />
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default CardBeranda;
