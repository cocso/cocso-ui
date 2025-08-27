import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { type PropsWithChildren, Suspense } from 'react';
import { ComponentPreview } from './component-preview';

export const ComponentExample = ({ name, children }: PropsWithChildren<{ name: string }>) => {
  if (!children) {
    return (
      <Suspense fallback={null}>
        <ComponentPreview name={name} />
      </Suspense>
    );
  }

  return (
    <Tabs items={['미리보기', '코드']}>
      <Tab value="미리보기">
        <ComponentPreview name={name} />
      </Tab>
      <Tab value="코드">{children}</Tab>
    </Tabs>
  );
};
