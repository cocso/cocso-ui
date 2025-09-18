'use client';

import { ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { ko } from 'date-fns/locale';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Typography } from '../typography';
import styles from './MonthPicker.module.css';

export interface MonthPickerProps extends ComponentPropsWithoutRef<'div'> {
  value?: Date;
  onValueChange?: (value: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

export const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(
  ({ className, value, onValueChange, children, minDate, maxDate, disabled, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (date: Date | null) => {
      onValueChange?.(date);
      setOpen(false);
    };

    return (
      <div ref={ref} className={cx(styles.root, className)} {...props}>
        <Dropdown open={open} onOpenChange={setOpen}>
          <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className={styles.content}>
              <DatePicker
                selected={value}
                onChange={handleChange}
                disabled={disabled}
                locale={ko}
                minDate={minDate}
                maxDate={maxDate}
                dateFormat="yyyy년 MM월 dd일"
                showPopperArrow={false}
                renderCustomHeader={({
                  date,
                  decreaseYear,
                  increaseYear,
                  prevYearButtonDisabled,
                  nextYearButtonDisabled,
                }) => (
                  <div className={styles.header}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={decreaseYear}
                      disabled={prevYearButtonDisabled}
                      className={styles.backButton}
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                    <Typography type="body" weight="semibold">
                      {date.toLocaleDateString('ko-KR', { year: 'numeric' })}
                    </Typography>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={increaseYear}
                      disabled={nextYearButtonDisabled}
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                  </div>
                )}
                inline
                showMonthYearPicker
              />
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>
    );
  },
);

MonthPicker.displayName = 'MonthPicker';
