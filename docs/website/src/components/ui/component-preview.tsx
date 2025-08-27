'use client';

import { lazy, Suspense } from '@suspensive/react';
import { useRef } from 'react';

type Props = { name: string };

export const ComponentPreview = ({ name }: Props) => {
  const cache = useRef<Record<string, React.ComponentType<unknown>>>({});

  if (!cache.current[name]) {
    cache.current[name] = lazy(() => import(`../example/${name}`));
  }

  const Component = cache.current[name];

  return (
    <Suspense fallback={null}>
      <div className="center w-full">
        <Component />
      </div>
    </Suspense>
  );
};
