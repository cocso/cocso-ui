'use client';

import { ArrowIOSForwardIcon } from '@cocso-ui/react-icons';
import { clsx as cx } from 'clsx';
import { ko } from 'date-fns/locale';
import { type ComponentPropsWithoutRef, forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from '../button';
import { Dropdown } from '../dropdown';
import { Typography } from '../typography';
import styles from './DayPicker.module.css';

export interface DayPickerProps extends ComponentPropsWithoutRef<'div'> {
  value?: Date;
  onValueChange?: (value: Date) => void;
  disabled?: boolean;
}

export const DayPicker = forwardRef<HTMLDivElement, DayPickerProps>(
  ({ className, value, onValueChange, disabled, children, ...props }, ref) => {
    const [open, setOpen] = useState<boolean>(false);

    const handleChange = (date: Date | null) => {
      if (date) {
        onValueChange?.(date);
        setOpen(false);
      }
    };

    return (
      <div ref={ref} className={cx(styles.root, className)} {...props}>
        <Dropdown open={open} onOpenChange={setOpen}>
          <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className={styles.content} aria-label="날짜 선택">
              <DatePicker
                selected={value}
                onChange={handleChange}
                disabled={disabled}
                locale={ko}
                dateFormat="yyyy년 MM월 dd일"
                showPopperArrow={false}
                dayClassName={date => {
                  const day = date.getDay();
                  if (day === 0) {
                    return styles.sunday;
                  }
                  if (day === 6) {
                    return styles.saturday;
                  }
                  return '';
                }}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className={styles.header}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={decreaseMonth}
                      disabled={prevMonthButtonDisabled}
                      className={styles.backButton}
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                    <Typography type="body" weight="semibold">
                      {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
                    </Typography>
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={increaseMonth}
                      disabled={nextMonthButtonDisabled}
                    >
                      <ArrowIOSForwardIcon />
                    </Button>
                  </div>
                )}
                inline
              />
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown>
      </div>
    );
  },
);

DayPicker.displayName = 'DayPicker';
