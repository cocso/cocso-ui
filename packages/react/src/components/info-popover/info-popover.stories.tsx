import type { Meta, StoryObj } from '@storybook/react';
import { InfoPopover } from './info-popover';

const meta = {
  title: 'Components/InfoPopover',
  component: InfoPopover,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    children: '같은 처방월의 금액은 정산처별로 합산됩니다.',
    label: '합산 기준',
  },
} satisfies Meta<typeof InfoPopover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Beside the heading it explains — the usual place. */
export const BesideATitle: Story = {
  render: args => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <h3 style={{ margin: 0, fontSize: '16px' }}>정산 금액</h3>
      <InfoPopover {...args} />
    </div>
  ),
};

/** The panel open, so it is under the pixel check. */
export const Open: Story = {
  parameters: { overlay: true },
  render: args => (
    <div style={{ height: '160px' }}>
      <InfoPopover {...args} defaultOpen />
    </div>
  ),
};

/** `width` widens the panel for a longer explanation. */
export const Wide: Story = {
  parameters: { overlay: true },
  render: args => (
    <div style={{ height: '200px' }}>
      <InfoPopover {...args} defaultOpen width={360}>
        같은 처방월의 금액은 정산처별로 합산됩니다. 이미 등록된 의약품과 같은 코드는 다시 등록할 수 없으며,
        수수료율이 0 인 의약품은 정산에서 제외됩니다.
      </InfoPopover>
    </div>
  ),
};
