import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  argTypes: {
    multiple: { control: 'boolean' },
  },
  args: {
    multiple: false,
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: args => (
    <Accordion {...args} style={{ width: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>첫 번째 항목</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>첫 번째 항목의 내용입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>두 번째 항목의 내용입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>세 번째 항목</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>세 번째 항목의 내용입니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion multiple style={{ width: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>첫 번째 항목</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>첫 번째 항목의 내용입니다.</Accordion.Content>
      </Accordion.Item>
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>두 번째 항목의 내용입니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const NoChevron: Story = {
  render: () => (
    <Accordion style={{ width: 400 }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger chevron={false}>chevron 없음</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>chevron 없이 표시되는 내용입니다.</Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};
