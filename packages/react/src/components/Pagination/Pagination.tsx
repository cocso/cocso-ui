import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

export type PaginationProps = {
  asChild?: boolean;
  page: number;
  count: number;
  onChange: (pageNumber: number) => void;
} & React.ComponentPropsWithoutRef<'div'>;

const GROUP_MAX = 5;
const HALF_GROUP = Math.ceil(GROUP_MAX / 2);

const PaginationComponent = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ asChild = false, page, count, onChange, className, ...props }, ref) => {
    const renderPageButton = (pageNumber: number) => (
      <button
        key={pageNumber}
        className="cocso-pagination-item"
        onClick={() => onChange(pageNumber)}
        data-active={page === pageNumber}
      >
        {pageNumber}
      </button>
    );

    const Comp = asChild ? Slot : 'div';

    return (
      <Comp ref={ref} className={`cocso-pagination ${className || ''}`} {...props}>
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
            .map((item, index) => renderPageButton(index + 1))
        ) : (
          <>
            {renderPageButton(1)}
            {page > 1 + HALF_GROUP && <span className="cocso-pagination-trunc">...</span>}
            {Array(GROUP_MAX)
              .fill(0)
              .map((_, index) => {
                const pageNumber = page - HALF_GROUP + index + 1;
                return pageNumber > 1 && pageNumber < count ? renderPageButton(pageNumber) : '';
              })}
            {page < count - HALF_GROUP && <span className="cocso-pagination-trunc">...</span>}
            {renderPageButton(count)}
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
      </Comp>
    );
  },
);

export const Pagination = Object.assign(PaginationComponent, {
  displayName: 'Pagination',
});
