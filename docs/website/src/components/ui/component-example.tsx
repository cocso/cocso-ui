'use client';

import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Component, type ReactNode, Suspense } from 'react';
import { ComponentPreview } from './component-preview';

class PreviewErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? <div>컴포넌트를 불러오지 못했습니다.</div> : this.props.children;
  }
}

interface ComponentExampleProps {
  name: string;
  children?: ReactNode;
}

export function ComponentExample({ name, children }: ComponentExampleProps) {
  const preview = (
    <PreviewErrorBoundary>
      <Suspense fallback={null}>
        <ComponentPreview name={name} />
      </Suspense>
    </PreviewErrorBoundary>
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
}
