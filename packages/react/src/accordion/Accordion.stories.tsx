import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from './Accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accordion 컴포넌트는 접을 수 있는 콘텐츠 섹션을 제공합니다.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: '아코디언 타입',
      control: 'select',
      options: ['single', 'multiple'],
      table: {
        type: { summary: "'single' | 'multiple'" },
      },
    },
    collapsible: {
      description: 'single 타입에서 열린 항목을 다시 닫을 수 있는지 여부',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
      },
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Accordion type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>첫 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>첫 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

export const SingleType: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Accordion type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>첫 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>첫 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>두 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>두 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Header>
            <Accordion.Trigger>세 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>세 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

export const MultipleType: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <Accordion type="multiple">
        <Accordion.Item value="item-1">
          <Accordion.Header>
            <Accordion.Trigger>첫 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>첫 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Header>
            <Accordion.Trigger>두 번째 아이템</Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content>
            <div style={{ padding: '16px 0' }}>두 번째 아이템의 내용입니다.</div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
};
