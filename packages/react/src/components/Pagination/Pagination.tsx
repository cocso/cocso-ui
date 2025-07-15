interface PaginationProps {
  page: number;
  count: number;
  onChange: (val: number) => void;
}

const GROUP_MAX = 5;
const half = Math.ceil(GROUP_MAX / 2);

const PaginationContent = (props: PaginationProps) => {
  const { page, count, onChange } = props;

  const getButton = (current: number) => (
    <button
      key={current}
      className="cocso-pagination-item"
      onClick={() => onChange(current)}
      data-active={page === current}
    >
      {current}
    </button>
  );

  return (
    <div className="cocso-pagination">
      {count > 1 && (
        <button
          className="cocso-pagination-arrow"
          disabled={page === 1}
          onClick={() => page > 1 && onChange(page - 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      )}

      {count <= GROUP_MAX + 2 ? (
        Array(count)
          .fill(0)
          .map((item, index) => getButton(index + 1))
      ) : (
        <>
          {getButton(1)}
          {page > 1 + half && <span>...</span>}
          {Array(GROUP_MAX)
            .fill(0)
            .map((_, index) => {
              const p = page - half + index + 1;
              return p > 1 && p < count ? getButton(p) : '';
            })}
          {page < count - half && <span>...</span>}
          {getButton(count)}
        </>
      )}

      {count > 1 && (
        <button
          className="cocso-pagination-arrow"
          disabled={page === count}
          onClick={() => page < count && onChange(page + 1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      )}
    </div>
  );
};

export const Pagination = Object.assign(PaginationContent, {});
