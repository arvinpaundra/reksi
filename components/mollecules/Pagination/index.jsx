import ReactPaginate from 'react-paginate';

const Paginate = (props) => {
  const { pageChange, pages } = props;

  return (
    <nav role="navigation" aria-label="pagination">
      <ReactPaginate
        previousLabel="< Prev"
        nextLabel="Next >"
        onPageChange={pageChange}
        pageCount={Math.min(5, pages)}
        pageRangeDisplayed={2}
        breakClassName="px-4 py-2 bg-white cursor-default tracking-widest"
        containerClassName="flex items-center text-black/90 select-none"
        pageLinkClassName="hover:bg-blue/10 border-y border-blue/60 px-4 py-2 font-medium transition ease-in-out duration-200"
        previousLinkClassName="hover:bg-blue/10 border border-blue/60 py-2 px-4 font-medium transition ease-in-out duration-200 rounded-l-lg"
        nextLinkClassName="hover:bg-blue/10 border border-blue/60 py-2 px-4 font-medium transition ease-in-out duration-200 rounded-r-lg"
        activeLinkClassName="bg-blue/10 border-y border-blue/60 px-4 py-2 font-medium"
      />
    </nav>
  );
};

export default Paginate;
