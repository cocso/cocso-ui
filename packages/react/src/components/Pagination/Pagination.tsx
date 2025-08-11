import * as React from 'react';
import { createClassName } from '../../utils/cn';

export type PaginationProps = {
  page: number;
  totalPages: number;
  maxVisible?: number;
  onChange: (pageNumber: number) => void;
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange'>;

const PaginationComponent = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, page, totalPages, maxVisible = 5, onChange, ...props }, ref) => {
    const halfVisible = Math.ceil(maxVisible / 2);

    const renderPageButton = (pageNumber: number) => (
      <button
        key={pageNumber}
        type="button"
        className="cocso-pagination-item"
        onClick={() => onChange(pageNumber)}
        data-active={page === pageNumber}
      >
        {pageNumber}
      </button>
    );

    const classNames = createClassName('cocso-pagination', {}, [], className);

    return (
      <div ref={ref} className={classNames} {...props}>
        {totalPages > 1 && (
          <button
            className="cocso-pagination-arrow"
            type="button"
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
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}

        {totalPages <= maxVisible + 2 ? (
          Array(totalPages)
            .fill(0)
            .map((_, index) => renderPageButton(index + 1))
        ) : (
          <>
            {renderPageButton(1)}
            {page > 1 + halfVisible && <span className="cocso-pagination-trunc">...</span>}
            {Array(maxVisible)
              .fill(0)
              .map((_, index) => {
                const pageNumber = page - halfVisible + index + 1;
                return pageNumber > 1 && pageNumber < totalPages
                  ? renderPageButton(pageNumber)
                  : '';
              })}
            {page < totalPages - halfVisible && <span className="cocso-pagination-trunc">...</span>}
            {renderPageButton(totalPages)}
          </>
        )}

        {totalPages > 1 && (
          <button
            className="cocso-pagination-arrow"
            type="button"
            disabled={page === totalPages}
            onClick={() => page < totalPages && onChange(page + 1)}
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
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        )}
      </div>
    );
  },
);

export const Pagination = Object.assign(PaginationComponent, {
  displayName: 'Pagination',
});
