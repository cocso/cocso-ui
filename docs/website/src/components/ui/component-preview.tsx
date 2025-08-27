'use client';

import { lazy, Suspense, useMemo } from 'react';

export const ComponentPreview = ({ name }: { name: string }) => {
  const Preview = useMemo(() => {
    const Component = lazy(() => import(`../example/${name}.tsx`));

    if (!Component) {
      return <div>컴포넌트가 존재하지 않습니다.</div>;
    }

    return <Component />;
  }, [name]);

  return (
    <Suspense fallback={null}>
      <div className="center w-full">{Preview}</div>
    </Suspense>
  );
};
