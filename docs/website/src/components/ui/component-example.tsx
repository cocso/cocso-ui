'use client';

import { ErrorBoundary, Suspense } from '@suspensive/react';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import type { ReactNode } from 'react';
import { ComponentPreview } from './component-preview';

type Props = { name: string; children?: ReactNode };

export const ComponentExample = ({ name, children }: Props) => {
  const preview = (
    <ErrorBoundary fallback={<div>컴포넌트를 불러오지 못했습니다.</div>}>
      <Suspense fallback={null}>
        <ComponentPreview name={name} />
      </Suspense>
    </ErrorBoundary>
  );

  if (!children) {
    return preview;
  }

  return (
    <Tabs items={['Preview', 'Code']}>
      <Tab value="Preview">{preview}</Tab>
      <Tab value="Code">{children}</Tab>
    </Tabs>
  );
};
