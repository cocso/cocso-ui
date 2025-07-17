import * as React from 'react';
import { createClassName } from '../../utils/cn';
import { Label } from '../Label';

export type QuantityStatus = '보통' | '여유' | '부족';

export type QuantityStatusProps = {
  quantity: QuantityStatus;
} & React.ComponentPropsWithoutRef<'div'>;

const StockQuantityStatusContent = React.forwardRef<HTMLDivElement, QuantityStatusProps>(
  ({ quantity, className, onChange, ...props }, ref) => {
    const classNames = createClassName('cocso-stock-quantity-status', {}, [], className);

    return (
      <div ref={ref} className={classNames} data-status={quantity} {...props}>
        <span className="cocso-stock-quantity-status-indicator">
          {quantity === '여유' ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.06494 13.0754C4.26764 13.0754 1.99999 10.8199 2 8.03765C2.00001 5.25543 4.26766 3 7.06494 3L9.48051 3V6.10011L7.06494 6.10011C5.98906 6.10011 5.11689 6.96758 5.11689 8.03767C5.11688 9.10776 5.98906 9.97524 7.06494 9.97524L9.48051 9.97524V13.0754H7.06494Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M9.48051 9.97524L9.48051 6.10011L12.0519 6.10026C13.1278 6.10026 14 6.96774 14 8.03783C14 9.10792 13.1278 9.9754 12.0519 9.9754L9.48051 9.97524Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M9.48047 6.10059H7.06543C5.98955 6.10059 5.11719 6.968 5.11719 8.03809C5.11741 9.10782 5.98893 9.97532 7.06445 9.97559H9.48047V13.0752H7.06445C4.35911 13.0749 2.14983 10.9652 2.00781 8.30957V7.76465C2.15041 5.10939 4.36025 3 7.06543 3H9.48047V6.10059ZM12.0518 6.10059C13.1276 6.10059 14 6.968 14 8.03809C13.9999 9.10806 13.1276 9.97559 12.0518 9.97559H9.48047V6.10059H12.0518Z"
                fill="currentColor"
              />
            </svg>
          ) : quantity === '보통' ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.06494 13.0754C4.26764 13.0754 1.99999 10.8199 2 8.03765C2.00001 5.25543 4.26766 3 7.06494 3L9.48051 3V6.10011L7.06494 6.10011C5.98906 6.10011 5.11689 6.96758 5.11689 8.03767C5.11688 9.10776 5.98906 9.97524 7.06494 9.97524L9.48051 9.97524V13.0754H7.06494Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M9.48051 9.97524L9.48051 6.10011L12.0519 6.10026C13.1278 6.10026 14 6.96774 14 8.03783C14 9.10792 13.1278 9.9754 12.0519 9.9754L9.48051 9.97524Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M9.48145 6.0752V6.10059H7.06641C5.99053 6.10059 5.11817 6.968 5.11816 8.03809C5.11839 9.10782 5.98991 9.97532 7.06543 9.97559H9.48145V13.0752H7.06543C4.35577 13.0749 2.14345 10.9585 2.00781 8.29688V7.77832C2.03849 7.17662 2.17568 6.60303 2.40039 6.0752H9.48145ZM12.0527 6.10059C13.1286 6.10059 14.001 6.968 14.001 8.03809C14.0008 9.10806 13.1285 9.97559 12.0527 9.97559H9.48145V6.10059H12.0527Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7.06494 13.0754C4.26764 13.0754 1.99999 10.8199 2 8.03765C2.00001 5.25543 4.26766 3 7.06494 3L9.48051 3V6.10011L7.06494 6.10011C5.98906 6.10011 5.11689 6.96758 5.11689 8.03767C5.11688 9.10776 5.98906 9.97524 7.06494 9.97524L9.48051 9.97524V13.0754H7.06494Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M9.48051 9.97524L9.48051 6.10011L12.0519 6.10026C13.1278 6.10026 14 6.96774 14 8.03783C14 9.10792 13.1278 9.9754 12.0519 9.9754L9.48051 9.97524Z"
                fill="#D9D9D9"
                fillOpacity="0.85098"
              />
              <path
                d="M7.04688 9.97461C7.05273 9.97466 7.05859 9.97558 7.06445 9.97559H9.48047V13.0752H7.06445C4.95754 13.075 3.15182 11.7952 2.38867 9.97461H7.04688ZM12.0713 9.97461C12.0648 9.97467 12.0582 9.97559 12.0518 9.97559H9.48047V9.97461H12.0713Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
        <Label size="sm" color="currentColor">
          {quantity}
        </Label>
      </div>
    );
  },
);

export const StockQuantityStatus = Object.assign(StockQuantityStatusContent, {
  displayName: 'StockQuantityStatus',
});
