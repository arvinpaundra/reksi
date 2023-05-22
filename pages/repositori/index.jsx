/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import Link from 'next/link';
import Card from '../../components/atoms/Card';
import CardBody from '../../components/atoms/Card/CardBody';
import CardFooter from '../../components/atoms/Card/CardFooter';
import Divider from '../../components/atoms/Divider';
import Footer from '../../components/organisms/Footer';
import Navbar from '../../components/organisms/Navbar';
import { useCallback, useEffect, useState } from 'react';
import { getAllRepositories } from '../../services/repository';
import SelectCollection from '../../components/mollecules/Select/Collection';
import SelectDepartement from '../../components/mollecules/Select/Departement';
import { Listbox } from '@headlessui/react';
import { RiArrowDropDownLine } from 'react-icons/ri';
import Drawer from 'react-modern-drawer';
import Paginate from '../../components/mollecules/Pagination';
import Badge from '../../components/atoms/Badge';
import { FormatDateIntl } from '../../helper/format_date_intl';
import SelectCategory from '../../components/mollecules/Select/Category';

const Repositori = () => {
  const [repositories, setRepositories] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currPage, setCurrPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [loading, setLoading] = useState(null);

  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [collection, setCollection] = useState('');
  const [category, setCategory] = useState('');
  const [departement, setDepartement] = useState('');
  const [improvement, setImprovement] = useState('');
  const [sort, setSort] = useState('created_at DESC');

  const [collectionFilter, setCollectionFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departementFilter, setDepartementFilter] = useState('');
  const [improvementFilter, setImprovementFilter] = useState('Semua');
  const [sortFilter, setSortFilter] = useState('Terbaru');

  const [isOpenDrawer, setIsOpenDrawer] = useState(false);

  const getAllRepositoriesAPI = useCallback(
    async (keyword, collection_id, category_id, departement_id, improvement, sort, currPage) => {
      try {
        setLoading(true);
        const response = await getAllRepositories(
          keyword,
          collection_id,
          category_id,
          departement_id,
          improvement,
          sort,
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
    },
    [],
  );

  useEffect(() => {
    getAllRepositoriesAPI(keyword, collection, category, departement, improvement, sort, currPage);
  }, [
    getAllRepositoriesAPI,
    keyword,
    collection,
    category,
    departement,
    improvement,
    sort,
    currPage,
  ]);

  const pageChange = ({ selected }) => {
    setCurrPage(selected + 1);
  };

  const toggleDrawer = () => {
    setIsOpenDrawer((prevState) => !prevState);
  };

  const handlerFilter = (event) => {
    event.preventDefault();

    setCurrPage(0);
    setKeyword(query);
    setCollection(collectionFilter || '');
    setCategory(categoryFilter || '');
    setDepartement(departementFilter || '');
    setImprovement(
      improvementFilter === 'Semua' ? '' : improvementFilter === 'Hasil pengembangan' ? '1' : '0',
    );
    setSort(sortFilter === 'created_at DESC' ? 'crated_at DESC' : 'created_at ASC');

    setIsOpenDrawer(false);
  };

  const handlerClearFilter = () => {
    setCollectionFilter('');
    setCategoryFilter('');
    setDepartementFilter('');
    setImprovementFilter('Semua');
    setSortFilter('Terbaru');

    setQuery('');
    setKeyword('');
    setCollection('');
    setCategory('');
    setDepartement('');
    setImprovement('');
    setSort('created_at DESC');
  };

  const handleCollectionChange = ({ value }) => {
    setCollectionFilter(value);
  };

  const handleDepartementChange = ({ value }) => {
    setDepartementFilter(value);
  };

  const handleCategoryChange = ({ value }) => {
    setCategoryFilter(value);
  };

  return (
    <>
      <div>
        <Head>
          <title>Cari Karya Tulis Ilmiah</title>
        </Head>

        <div className="w-full min-h-screen flex flex-col justify-between">
          <div>
            <Navbar active="cari" />

            <main className="px-4 md:px-12 lg:px-24 2xl:px-[15%] mt-6 mb-20 lg:my-6">
              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit mb-4">
                <CardBody className="p-4 md:px-6 lg:px-10 flex flex-col gap-3">
                  <h3 className="font-semibold text-base md:text-xl">Cari karya tulis ilmiah</h3>
                  <form className="flex items-center gap-4" onSubmit={handlerFilter}>
                    <input
                      type="text"
                      className="flex-grow border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue"
                      placeholder="Cari berdasarkan judul . . ."
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                    />
                    <button
                      className="py-2 px-6 text-black font-medium rounded-xl border border-black bg-transparent hover:bg-black/5 hidden md:block"
                      type="button"
                      onClick={toggleDrawer}
                    >
                      Tambah Filter
                    </button>
                    <button
                      type="submit"
                      className="py-2 px-6 text-white font-medium rounded-xl bg-blue/80 hover:bg-blue hidden md:block"
                      onClick={handlerFilter}
                    >
                      Cari
                    </button>
                  </form>
                  <button
                    className="font-medium text-sm text-blue md:hidden self-start"
                    onClick={toggleDrawer}
                    type="button"
                  >
                    Tambah Filter
                  </button>
                </CardBody>
              </Card>

              <Card className="w-full bg-white rounded-lg overflow-hidden h-fit mb-4">
                <CardBody>
                  {repositories?.length > 0 ? (
                    repositories?.map((item) => (
                      <Link href={`/repositori/${item.id}`} key={item.id}>
                        <a>
                          <div className="p-4 md:px-6 lg:px-10 md:flex md:gap-4">
                            <img
                              src="/images/Rectangle.png"
                              alt=""
                              className="hidden md:block w-24 h-32"
                            />
                            <div>
                              <h3 className="text-base font-medium text-justify mb-1">
                                {item.title}
                              </h3>
                              {item.authors?.map((author) => (
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
                                  {item.category}
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
                        <img
                          src="/images/empty-repository.png"
                          alt="empty-repository"
                          className="w-48"
                        />
                        <p className="p-4 md:px-6 lg:px-10 text-center">
                          Karya tulis ilmiah tidak ditemukan.
                        </p>
                      </div>
                    </>
                  )}
                </CardBody>

                {repositories?.length > 0 && (
                  <>
                    <Divider />

                    <CardFooter className="p-4 flex flex-col items-center justify-center">
                      <div className="pt-6 md:pt-6 pb-4 flex flex-col items-center justify-center">
                        <Paginate pageChange={pageChange} pages={pages} />
                      </div>
                    </CardFooter>
                  </>
                )}
              </Card>
            </main>
          </div>

          <Footer />
        </div>
      </div>

      {/* Filter */}
      <Drawer
        open={isOpenDrawer}
        onClose={toggleDrawer}
        direction="right"
        size={400}
        lockBackgroundScroll={true}
        className="overflow-y-auto"
      >
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg md:text-xl">Filter</h3>
        </div>

        <Divider />

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Koleksi
            </label>
            <SelectCollection onCollectionChange={handleCollectionChange} visibility="" />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Kategori
            </label>
            <SelectCategory onCategoryChange={handleCategoryChange} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Jurusan
            </label>
            <SelectDepartement onDepartementChange={handleDepartementChange} />
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Pengembangan
            </label>
            <Listbox value={improvementFilter} onChange={(event) => setImprovementFilter(event)}>
              <div className="relative">
                <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                  <span className="block truncate text-start">{improvementFilter}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Semua"
                  >
                    Semua
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Hasil pengembangan"
                  >
                    Hasil pengembangan
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Bukan hasil pengembangan"
                  >
                    Bukan hasil pengembangan
                  </Listbox.Option>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          <div className="flex flex-col gap-1 w-full">
            <label htmlFor="collection" className="text-black/90">
              Urutkan berdasarkan
            </label>
            <Listbox value={sortFilter} onChange={(event) => setSortFilter(event)}>
              <div className="relative">
                <Listbox.Button className="relative w-full border border-black/50 rounded-xl py-2 px-4 outline-none focus:border-blue">
                  <span className="block truncate text-start">{sortFilter}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <RiArrowDropDownLine className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute mt-1 max-h-60 z-10 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Terbaru"
                  >
                    Terbaru
                  </Listbox.Option>
                  <Listbox.Option
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 px-4 ${
                        active ? 'bg-green/10 text-black' : 'text-secondary'
                      }`
                    }
                    value="Terlama"
                  >
                    Terlama
                  </Listbox.Option>
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
        </div>

        <div className="w-full flex items-center justify-between p-4">
          <button
            onClick={handlerClearFilter}
            className="flex items-center justify-center p-2 w-40 2xl:w-48 hover:bg-red/10 rounded-lg text-red"
          >
            <p>Reset</p>
          </button>

          <button
            className="p-2 w-40 2xl:w-48 text-white font-medium rounded-xl bg-orange/80 hover:bg-orange"
            onClick={handlerFilter}
          >
            Cari
          </button>
        </div>
      </Drawer>
    </>
  );
};

export default Repositori;