import type { Meta, StoryObj } from '@storybook/react';
import { PersonIcon, SettingsIcon } from '@cocso-ui/react-icons';
import { Card } from '../card';
import { SummaryCard } from './summary-card';

const meta = {
  title: 'Components/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: '총 CSO사 수' },
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <SummaryCard {...args} icon={<PersonIcon size={20} />}>
      <SummaryCard.Value count={128} href="#dealers" suffix="개" />
    </SummaryCard>
  ),
};

/** Without `href` the figure is plain text. */
export const WithoutLink: Story = {
  render: args => (
    <SummaryCard {...args} icon={<PersonIcon size={20} />}>
      <SummaryCard.Value count="1,234,000" suffix="원" />
    </SummaryCard>
  ),
};

/** A dashboard row, each figure in a `Card`. */
export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 160px)', gap: '16px' }}>
      <Card variant="outlined">
        <SummaryCard icon={<SettingsIcon size={20} />} label="승인 요청">
          <SummaryCard.Value count={3} href="#pending" suffix="건" />
        </SummaryCard>
      </Card>
      <Card variant="outlined">
        <SummaryCard icon={<PersonIcon size={20} />} label="총 CSO사 수">
          <SummaryCard.Value count={128} href="#dealers" suffix="개" />
        </SummaryCard>
      </Card>
      <Card variant="outlined">
        <SummaryCard icon={<PersonIcon size={20} />} label="총 유저 수">
          <SummaryCard.Value count={1024} href="#users" suffix="명" />
        </SummaryCard>
      </Card>
    </div>
  ),
};
