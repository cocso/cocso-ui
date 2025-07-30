import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from '@cocso-ui/react';

const meta = {
  title: 'react/pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    page: {
      control: { type: 'number', min: 1 },
      description: '현재 페이지 번호',
    },
    totalPages: {
      control: { type: 'number', min: 1 },
      description: '전체 페이지 수',
    },
    maxVisible: {
      control: { type: 'number', min: 3, max: 10 },
      description: '한 번에 표시할 최대 페이지 버튼 수',
    },
    onChange: {
      description: '페이지 변경 시 호출되는 콜백 함수',
    },
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    page: 1,
    totalPages: 10,
    onChange: () => {},
  },
};

export const SmallPageCount: Story = {
  args: {
    page: 1,
    totalPages: 5,
    onChange: () => {},
  },
};

export const LargePageCount: Story = {
  args: {
    page: 50,
    totalPages: 100,
    onChange: () => {},
  },
};

export const SinglePage: Story = {
  args: {
    page: 1,
    totalPages: 1,
    onChange: () => {},
  },
};

export const AllVariations: Story = {
  args: {
    page: 1,
    totalPages: 5,
    onChange: () => {},
  },
  render: () => {
    const [pages, setPages] = useState({
      small: 1,
      medium: 1,
      large: 50,
      single: 1,
    });

    const handlePageChange = (key: string) => (page: number) => {
      setPages(prev => ({ ...prev, [key]: page }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            작은 페이지 수 (5페이지)
          </h3>
          <Pagination
            page={pages.small}
            totalPages={5}
            onChange={handlePageChange('small')}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            중간 페이지 수 (10페이지)
          </h3>
          <Pagination
            page={pages.medium}
            totalPages={10}
            onChange={handlePageChange('medium')}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            큰 페이지 수 (100페이지) - 페이지네이션 그룹 표시
          </h3>
          <Pagination
            page={pages.large}
            totalPages={100}
            onChange={handlePageChange('large')}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            단일 페이지 (1페이지)
          </h3>
          <Pagination
            page={pages.single}
            totalPages={1}
            onChange={handlePageChange('single')}
          />
        </div>
      </div>
    );
  },
};

export const InteractiveExample: Story = {
  args: {
    page: 1,
    totalPages: 20,
    onChange: () => {},
  },
  render: () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(20);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    const handleTotalPagesChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newTotal = parseInt(event.target.value);
      setTotalPages(newTotal);
      setCurrentPage(1);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: '400px' }}>
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>
            인터랙티브 페이지네이션 예제
          </h3>
          <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#666' }}>
            현재 페이지: {currentPage} / {totalPages}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500' }}>전체 페이지 수:</label>
          <select
            value={totalPages}
            onChange={handleTotalPagesChange}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
            }}
          >
            <option value={1}>1페이지</option>
            <option value={5}>5페이지</option>
            <option value={10}>10페이지</option>
            <option value={20}>20페이지</option>
            <option value={50}>50페이지</option>
            <option value={100}>100페이지</option>
          </select>
        </div>

        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={handlePageChange}
        />

        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>사용법:</strong>
          <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
            <li>화살표 버튼으로 이전/다음 페이지로 이동</li>
            <li>숫자 버튼을 클릭하여 특정 페이지로 이동</li>
            <li>페이지 수가 많을 때는 그룹 단위로 표시</li>
            <li>첫 페이지나 마지막 페이지에서는 해당 방향 화살표가 비활성화</li>
          </ul>
        </div>
      </div>
    );
  },
};

export const EdgeCases: Story = {
  args: {
    page: 1,
    totalPages: 1,
    onChange: () => {},
  },
  render: () => {
    const [pages, setPages] = useState({
      first: 1,
      last: 100,
      middle: 50,
    });

    const handlePageChange = (key: string) => (page: number) => {
      setPages(prev => ({ ...prev, [key]: page }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            첫 페이지 (이전 버튼 비활성화)
          </h3>
          <Pagination
            page={pages.first}
            totalPages={100}
            onChange={handlePageChange('first')}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            중간 페이지 (양쪽 화살표 활성화)
          </h3>
          <Pagination
            page={pages.middle}
            totalPages={100}
            onChange={handlePageChange('middle')}
          />
        </div>

        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>
            마지막 페이지 (다음 버튼 비활성화)
          </h3>
          <Pagination
            page={pages.last}
            totalPages={100}
            onChange={handlePageChange('last')}
          />
        </div>
      </div>
    );
  },
}; 