import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './Pagination.module.css';

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  page: number;
  totalPages: number;
  maxVisible?: number;
  onChange: (pageNumber: number) => void;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, page, totalPages, maxVisible = 5, onChange, ...props }, ref) => {
    const halfVisible = Math.ceil(maxVisible / 2);

    const renderPageButton = (pageNumber: number) => (
      <button
        key={pageNumber}
        type="button"
        className={styles.item}
        onClick={() => onChange(pageNumber)}
        data-active={page === pageNumber}
      >
        {pageNumber}
      </button>
    );

    return (
      <div ref={ref} className={cx(styles.pagination, className)} {...props}>
        {totalPages > 1 && (
          <button
            className={styles.arrow}
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
            {page > 1 + halfVisible && <span className={styles.trunc}>...</span>}
            {Array(maxVisible)
              .fill(0)
              .map((_, index) => {
                const pageNumber = page - halfVisible + index + 1;
                return pageNumber > 1 && pageNumber < totalPages
                  ? renderPageButton(pageNumber)
                  : '';
              })}
            {page < totalPages - halfVisible && <span className={styles.trunc}>...</span>}
            {renderPageButton(totalPages)}
          </>
        )}

        {totalPages > 1 && (
          <button
            className={styles.arrow}
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
