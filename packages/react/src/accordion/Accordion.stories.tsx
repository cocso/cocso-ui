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

export const AllVariants: Story = {
  parameters: {
    controls: { disable: true },
  },
  args: {},
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '500px' }}>
      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Single Type</h4>
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
        </Accordion>
      </div>

      <div>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600' }}>Multiple Type</h4>
        <Accordion type="multiple">
          <Accordion.Item value="multi-1">
            <Accordion.Header>
              <Accordion.Trigger>Multiple 첫 번째</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px 0' }}>Multiple 첫 번째 내용입니다.</div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="multi-2">
            <Accordion.Header>
              <Accordion.Trigger>Multiple 두 번째</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px 0' }}>Multiple 두 번째 내용입니다.</div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  ),
};

export const Playground: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
};
