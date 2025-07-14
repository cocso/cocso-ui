import type { Meta, StoryObj } from '@storybook/react';
import { Accordion } from '@cocso-ui/react';

const meta = {
  title: 'React/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
    },
    collapsible: {
      control: 'boolean',
    },
    defaultValue: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
    defaultValue: 'item-1',
  },
  render: (args) => (
    <Accordion {...args} style={{ width: '400px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>아코디언 제목 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이것은 첫 번째 아코디언의 내용입니다. 여기에 다양한 정보를 포함할 수 있습니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>아코디언 제목 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이것은 두 번째 아코디언의 내용입니다. 더 많은 정보를 포함할 수 있습니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>아코디언 제목 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이것은 세 번째 아코디언의 내용입니다. 마지막 아코디언입니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
    defaultValue: ['item-1'],
  },
  render: (args) => (
    <Accordion {...args} style={{ width: '400px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>다중 선택 아코디언 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            여러 아코디언을 동시에 열 수 있습니다. 이는 첫 번째 항목입니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>다중 선택 아코디언 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이것은 두 번째 항목입니다. 첫 번째와 함께 열 수 있습니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>다중 선택 아코디언 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이것은 세 번째 항목입니다. 모든 항목을 동시에 열 수 있습니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const NotCollapsible: Story = {
  args: {
    type: 'single',
    collapsible: false,
    defaultValue: 'item-1',
  },
  render: (args) => (
    <Accordion {...args} style={{ width: '400px' }}>
      <Accordion.Item value="item-1">
        <Accordion.Header>
          <Accordion.Trigger>접을 수 없는 아코디언 1</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            이 아코디언은 접을 수 없습니다. 항상 하나의 항목이 열려있어야 합니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-2">
        <Accordion.Header>
          <Accordion.Trigger>접을 수 없는 아코디언 2</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            다른 항목을 클릭하면 이 항목이 닫히고 새 항목이 열립니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="item-3">
        <Accordion.Header>
          <Accordion.Trigger>접을 수 없는 아코디언 3</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '16px' }}>
            항상 최소 하나의 항목이 열려있어야 합니다.
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
};

export const AllVariations: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Single Collapsible */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Single Collapsible
        </h3>
        <Accordion type="single" collapsible style={{ width: '400px' }}>
          <Accordion.Item value="single-1">
            <Accordion.Header>
              <Accordion.Trigger>단일 선택 (접을 수 있음)</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                한 번에 하나의 항목만 열 수 있고, 모든 항목을 접을 수 있습니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="single-2">
            <Accordion.Header>
              <Accordion.Trigger>두 번째 항목</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                다른 항목을 클릭하면 이 항목이 닫힙니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Multiple */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Multiple
        </h3>
        <Accordion type="multiple" style={{ width: '400px' }}>
          <Accordion.Item value="multiple-1">
            <Accordion.Header>
              <Accordion.Trigger>다중 선택 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                여러 항목을 동시에 열 수 있습니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="multiple-2">
            <Accordion.Header>
              <Accordion.Trigger>다중 선택 2</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                이 항목도 함께 열 수 있습니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="multiple-3">
            <Accordion.Header>
              <Accordion.Trigger>다중 선택 3</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                모든 항목을 동시에 열 수 있습니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>

      {/* Not Collapsible */}
      <div>
        <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
          Single Not Collapsible
        </h3>
        <Accordion type="single" collapsible={false} defaultValue="not-collapsible-1" style={{ width: '400px' }}>
          <Accordion.Item value="not-collapsible-1">
            <Accordion.Header>
              <Accordion.Trigger>접을 수 없음 1</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                항상 하나의 항목이 열려있어야 합니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="not-collapsible-2">
            <Accordion.Header>
              <Accordion.Trigger>접을 수 없음 2</Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <div style={{ padding: '16px' }}>
                다른 항목을 클릭하면 이 항목이 닫히고 새 항목이 열립니다.
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  ),
};

export const ComplexContent: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: () => (
    <Accordion type="single" collapsible style={{ width: '500px' }}>
      <Accordion.Item value="complex-1">
        <Accordion.Header>
          <Accordion.Trigger>복잡한 내용이 포함된 아코디언</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
              제목
            </h4>
            <p style={{ margin: '0 0 16px 0', lineHeight: '1.6' }}>
              이것은 아코디언 내부에 포함된 복잡한 내용의 예시입니다. 
              다양한 HTML 요소들을 포함할 수 있습니다.
            </p>
            <ul style={{ margin: '0 0 16px 0', paddingLeft: '20px' }}>
              <li>목록 항목 1</li>
              <li>목록 항목 2</li>
              <li>목록 항목 3</li>
            </ul>
            <div style={{ 
              padding: '12px', 
              backgroundColor: '#f3f4f6', 
              borderRadius: '6px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <strong>참고:</strong> 아코디언은 어떤 종류의 콘텐츠든 포함할 수 있습니다.
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
      
      <Accordion.Item value="complex-2">
        <Accordion.Header>
          <Accordion.Trigger>폼 요소가 포함된 아코디언</Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content>
          <div style={{ padding: '20px' }}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  이름
                </label>
                <input 
                  type="text" 
                  placeholder="이름을 입력하세요"
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                  이메일
                </label>
                <input 
                  type="email" 
                  placeholder="이메일을 입력하세요"
                  style={{ 
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <button 
                type="submit"
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                제출
              </button>
            </form>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  ),
}; 