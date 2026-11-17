import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../button';
import { Card } from '../card';
import { SectionHeader } from './section-header';

const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: '의약품 관리' },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

const actions = (
  <>
    <Button size="x-small" variant="outline">
      엑셀 다운로드
    </Button>
    <Button size="x-small" variant="outline">
      일괄 수정
    </Button>
    <Button size="x-small">추가</Button>
  </>
);

export const Default: Story = {
  render: args => (
    <div style={{ width: '560px' }}>
      <SectionHeader {...args} />
    </div>
  ),
};

export const WithActions: Story = {
  render: args => (
    <div style={{ width: '560px' }}>
      <SectionHeader {...args} actions={actions} />
    </div>
  ),
};

export const WithDescription: Story = {
  render: args => (
    <div style={{ width: '560px' }}>
      <SectionHeader {...args} actions={actions} description="등록된 의약품의 수수료율을 관리합니다." />
    </div>
  ),
};

/** The usual place: the first child of a `Card`. */
export const InCard: Story = {
  render: args => (
    <Card style={{ width: '560px' }}>
      <SectionHeader {...args} actions={actions} />
      <p style={{ margin: 0 }}>카드 내용</p>
    </Card>
  ),
};

/** Too narrow for the actions beside the title: they collapse behind a toggle. */
export const Collapsed: Story = {
  render: args => (
    <div style={{ width: '240px' }}>
      <SectionHeader {...args} actions={actions} moreLabel="더보기" />
    </div>
  ),
};

/** The collapsed panel open, so it is under the pixel check. */
export const CollapsedOpen: Story = {
  parameters: { overlay: true },
  render: args => (
    <div style={{ width: '240px', height: '160px' }}>
      <SectionHeader {...args} actions={actions} defaultActionsOpen moreLabel="더보기" />
    </div>
  ),
};
