'use client';

import { ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { type ComponentPropsWithoutRef, forwardRef, useEffect, useState } from 'react';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Typography } from '../typography';
import styles from './MonthPicker.module.css';

export interface MonthPickerProps extends ComponentPropsWithoutRef<'div'> {
  value?: Date;
  onValueChange?: (value: Date | undefined) => void;
  minYear?: number;
  maxYear?: number;
}

const MONTHS = [
  '1월',
  '2월',
  '3월',
  '4월',
  '5월',
  '6월',
  '7월',
  '8월',
  '9월',
  '10월',
  '11월',
  '12월',
];

export const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(
  (
    { className, value, onValueChange, minYear = 1900, maxYear = 2100, children, ...props },
    ref,
  ) => {
    const [open, setOpen] = useState<boolean>(false);

    const [displayYear, setDisplayYear] = useState<number>(
      value?.getFullYear() ?? new Date().getFullYear(),
    );

    useEffect(() => {
      if (value) {
        setDisplayYear(value.getFullYear());
      }
    }, [value]);

    const handleMonthSelect = (month: number) => {
      const newValue = new Date(displayYear, month - 1, 1);
      onValueChange?.(newValue);
      setOpen(false);
    };

    const handleYearChange = (year: number) => {
      const clampedYear = Math.max(minYear, Math.min(maxYear, year));
      setDisplayYear(clampedYear);
    };

    return (
      <div ref={ref} className={cx(styles.root, className)} {...props}>
        <Dropdown open={open} onOpenChange={setOpen}>
          <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className={styles.content} role="listbox" aria-label="월 선택">
              <div className={styles.header}>
                <Button
                  type="button"
                  size="xs"
                  variant="secondary"
                  onClick={() => handleYearChange(displayYear - 1)}
                  disabled={displayYear <= minYear}
                  svgOnly
                  aria-label="이전 년도"
                >
                  <ArrowIOSForwardIcon className={styles.rotate} />
                </Button>
                <Typography type="body" weight="semibold">
                  {displayYear}년
                </Typography>
                <Button
                  type="button"
                  size="xs"
                  variant="secondary"
                  onClick={() => handleYearChange(displayYear + 1)}
                  disabled={displayYear >= maxYear}
                  aria-label="다음 년도"
                >
                  <ArrowIOSForwardIcon />
                </Button>
              </div>

              <div className={styles.grid}>
                {MONTHS.map((month, index) => {
                  const monthNumber = index + 1;
                  const isSelected =
                    value?.getFullYear() === displayYear && value?.getMonth() === monthNumber - 1;

                  return (
                    <Button
                      key={month}
                      type="button"
                      variant={isSelected ? 'tertiary' : 'secondary'}
                      onClick={() => handleMonthSelect(monthNumber)}
                      role="option"
                      aria-selected={isSelected}
                      aria-label={`${month} 선택`}
                    >
                      {month}
                    </Button>
                  );
                })}
              </div>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>
    );
  },
);

MonthPicker.displayName = 'MonthPicker';
