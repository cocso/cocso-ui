'use client';

import { lazy, Suspense, useRef } from 'react';

export function ComponentPreview({ name }: { name: string }) {
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
}
