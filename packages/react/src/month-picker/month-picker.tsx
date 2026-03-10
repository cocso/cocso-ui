'use client';

import { ArrowIOSBackwardIcon, ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { ko } from 'date-fns/locale';
import { type ComponentPropsWithoutRef, type ReactElement, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Typography } from '../typography';
import styles from './month-picker.module.css';

export interface MonthPickerProps extends ComponentPropsWithoutRef<'div'> {
  disabled?: boolean;
  maxDate?: Date;
  minDate?: Date;
  onValueChange?: (value: Date | null) => void;
  value?: Date;
}

export const MonthPicker = forwardRef<HTMLDivElement, MonthPickerProps>(
  ({ className, value, onValueChange, children, minDate, maxDate, disabled, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (date: Date | null) => {
      onValueChange?.(date);
      setOpen(false);
    };

    return (
      <div className={cx(styles.root, className)} ref={ref} {...props}>
        <Dropdown onOpenChange={(value) => setOpen(value)} open={open}>
          <Dropdown.Trigger render={children as ReactElement} />
          <Dropdown.Content className={styles.content}>
              <DatePicker
                dateFormat="yyyy년 MM월 dd일"
                disabled={disabled}
                inline
                locale={ko}
                maxDate={maxDate}
                minDate={minDate}
                onChange={handleChange}
                renderCustomHeader={({
                  date,
                  decreaseYear,
                  increaseYear,
                  prevYearButtonDisabled,
                  nextYearButtonDisabled,
                }) => (
                  <>
                    <Button
                      disabled={prevYearButtonDisabled}
                      onClick={decreaseYear}
                      size="xs"
                      type="button"
                      variant="secondary"
                    >
                      <ArrowIOSBackwardIcon />
                    </Button>
                    <Typography type="body" weight="semibold">
                      {date.toLocaleDateString('ko-KR', { year: 'numeric' })}
                    </Typography>
                    <Button
                      disabled={nextYearButtonDisabled}
                      onClick={increaseYear}
                      size="xs"
                      type="button"
                      variant="secondary"
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                  </>
                )}
                selected={value}
                showMonthYearPicker
                showPopperArrow={false}
              />
            </Dropdown.Content>
        </Dropdown>
      </div>
    );
  }
);

MonthPicker.displayName = 'MonthPicker';
