import { cloneElement } from 'react';

import Child from './child';
import { IconProps } from './types';

const DEFAULT_ICON_SIZE = 16;

const Icon = ({ children, width, height, size = DEFAULT_ICON_SIZE, ...props }: IconProps) => {
  return cloneElement(<Child>{children}</Child>, {
    width: width ?? size,
    height: height ?? size,
    'aria-hidden':
      props['aria-hidden'] !== undefined
        ? props['aria-hidden']
        : !(props['aria-label'] || props['aria-labelledby']),
    ...props,
  });
};

export default Icon;
