import {
  ArrowIOSBackwardIcon,
  ArrowIOSForwardIcon,
  MoreHorizIcon,
} from "@cocso-ui/react-icons";
import type { ComponentProps } from "react";
import { cn } from "../../cn";
import styles from "./pagination.module.css";

export interface PaginationLabels {
  navigation?: string;
  next?: string;
  page?: (n: number) => string;
  previous?: string;
}

export interface PaginationProps
  extends Omit<ComponentProps<"nav">, "onChange"> {
  labels?: PaginationLabels;
  maxVisible?: number;
  onChange: (pageNumber: number) => void;
  page: number;
  totalPages: number;
}

export function Pagination({
  ref,
  className,
  page,
  totalPages,
  maxVisible = 5,
  onChange,
  labels,
  ...props
}: PaginationProps) {
  const halfVisible = Math.ceil(maxVisible / 2);

  const navigationLabel = labels?.navigation ?? "페이지 탐색";
  const previousLabel = labels?.previous ?? "이전 페이지";
  const nextLabel = labels?.next ?? "다음 페이지";
  const pageLabel = labels?.page ?? ((n: number) => `${n} 페이지`);

  const renderPageButton = (pageNumber: number) => (
    <button
      aria-current={page === pageNumber ? "page" : undefined}
      aria-label={pageLabel(pageNumber)}
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
    <nav
      aria-label={navigationLabel}
      className={cn(styles.pagination, className)}
      ref={ref}
      {...props}
    >
      {totalPages > 1 && (
        <button
          aria-label={previousLabel}
          className={styles.arrow}
          disabled={page === 1}
          onClick={() => page > 1 && onChange(page - 1)}
          type="button"
        >
          <ArrowIOSBackwardIcon />
        </button>
      )}

      {totalPages <= maxVisible + 2 ? (
        Array.from({ length: totalPages }, (_, index) =>
          renderPageButton(index + 1)
        )
      ) : (
        <>
          {renderPageButton(1)}
          {page > 1 + halfVisible && (
            <span className={styles.trunc}>
              <MoreHorizIcon />
            </span>
          )}
          {Array.from({ length: maxVisible }, (_, index) => {
            const pageNumber = page - halfVisible + index + 1;
            return pageNumber > 1 && pageNumber < totalPages
              ? renderPageButton(pageNumber)
              : "";
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
          aria-label={nextLabel}
          className={styles.arrow}
          disabled={page === totalPages}
          onClick={() => page < totalPages && onChange(page + 1)}
          type="button"
        >
          <ArrowIOSForwardIcon />
        </button>
      )}
    </nav>
  );
}
