import { ArrowIOSBackwardIcon, ArrowIOSForwardIcon, MoreHorizIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef } from 'react';
import styles from './pagination.module.css';

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> {
  maxVisible?: number;
  onChange: (pageNumber: number) => void;
  page: number;
  totalPages: number;
}

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, page, totalPages, maxVisible = 5, onChange, ...props }, ref) => {
    const halfVisible = Math.ceil(maxVisible / 2);

    const renderPageButton = (pageNumber: number) => (
      <button
        className={styles.item}
        data-active={page === pageNumber}
        key={pageNumber}
        onClick={() => onChange(pageNumber)}
        type="button"
      >
        {pageNumber}
      </button>
    );

    return (
      <div className={cx(styles.pagination, className)} ref={ref} {...props}>
        {totalPages > 1 && (
          <button
            className={styles.arrow}
            disabled={page === 1}
            onClick={() => page > 1 && onChange(page - 1)}
            type="button"
          >
            <ArrowIOSBackwardIcon />
          </button>
        )}

        {totalPages <= maxVisible + 2 ? (
          new Array(totalPages).fill(0).map((_, index) => renderPageButton(index + 1))
        ) : (
          <>
            {renderPageButton(1)}
            {page > 1 + halfVisible && (
              <span className={styles.trunc}>
                <MoreHorizIcon />
              </span>
            )}
            {new Array(maxVisible).fill(0).map((_, index) => {
              const pageNumber = page - halfVisible + index + 1;
              return pageNumber > 1 && pageNumber < totalPages ? renderPageButton(pageNumber) : '';
            })}
            {page < totalPages - halfVisible && (
              <span className={styles.trunc}>
                <MoreHorizIcon />
              </span>
            )}
            {renderPageButton(totalPages)}
          </>
        )}

        {totalPages > 1 && (
          <button
            className={styles.arrow}
            disabled={page === totalPages}
            onClick={() => page < totalPages && onChange(page + 1)}
            type="button"
          >
            <ArrowIOSForwardIcon />
          </button>
        )}
      </div>
    );
  }
);
