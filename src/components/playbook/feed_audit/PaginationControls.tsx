export const PaginationControls = ({
  page,
  setPage,
  total,
  pageSize,
}: {
  page: number;
  setPage: (n: number) => void;
  total: number;
  pageSize: number;
}) => {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className='flex items-center justify-center gap-2 my-4'>
      <button
        className='px-2 py-1 border rounded disabled:opacity-50'
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
      >
        Prev
      </button>
      <span className='text-sm'>
        Page {page} of {totalPages}
      </span>
      <button
        className='px-2 py-1 border rounded disabled:opacity-50'
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
};
