import type { Meta, StoryObj } from '@storybook/react';
import type { SVGAttributes } from 'react';
import * as ReactIcons from '@cocso-ui/react-icons';

type IconProps = {
  size?: number;
  width?: number | string;
  height?: number | string;
} & SVGAttributes<SVGElement>;

const meta: Meta = {
  title: 'react-icons',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// 모든 아이콘 컴포넌트를 가져오는 함수
const getAllIcons = () => {
  const icons: { [key: string]: React.ComponentType<IconProps> } = {};
  
  Object.entries(ReactIcons).forEach(([name, component]) => {
    if (typeof component === 'function' && name.endsWith('Icon') || name.endsWith('Logo')) {
      icons[name] = component as React.ComponentType<IconProps>;
    }
  });
  
  return icons;
};

// 아이콘을 카테고리별로 분류하는 함수
const categorizeIcons = () => {
  const icons = getAllIcons();
  const categories: { [key: string]: { [key: string]: React.ComponentType<IconProps> } } = {
    brand: {},
    semantic: {},
    other: {}
  };
  
  Object.entries(icons).forEach(([name, component]) => {
    if (name.includes('Logo')) {
      categories.brand[name] = component;
    } else if (name.includes('Icon')) {
      categories.semantic[name] = component;
    } else {
      categories.other[name] = component;
    }
  });
  
  return categories;
};

// 아이콘 그리드 컴포넌트
const IconGrid = ({ 
  icons, 
  title, 
  size = 32, 
  showNames = true,
  showColors = false 
}: {
  icons: { [key: string]: React.ComponentType<IconProps> };
  title: string;
  size?: number;
  showNames?: boolean;
  showColors?: boolean;
}) => {
  const colors = showColors ? ['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'] : ['#000000'];
  
  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
        gap: '20px',
        width: '100%',
        maxWidth: '800px'
      }}>
        {Object.entries(icons).map(([name, IconComponent]) => (
          <div key={name} style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '8px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fafafa'
          }}>
            {colors.map((color, colorIndex) => (
              <div key={colorIndex} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconComponent size={size} style={{ color }} />
                {showColors && colors.length > 1 && (
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    backgroundColor: color, 
                    borderRadius: '50%',
                    border: '1px solid #d1d5db'
                  }} />
                )}
              </div>
            ))}
            {showNames && (
              <span style={{ 
                fontSize: '12px', 
                textAlign: 'center',
                color: '#6b7280',
                wordBreak: 'break-word',
                lineHeight: '1.2'
              }}>
                {name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 모든 아이콘을 보여주는 메인 스토리
export const AllIcons: Story = {
  render: () => {
    const categories = categorizeIcons();
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          All React Icons ({Object.values(categories).reduce((acc, cat) => acc + Object.keys(cat).length, 0)} total)
        </h2>
        
        {Object.entries(categories).map(([categoryName, icons]) => {
          if (Object.keys(icons).length === 0) return null;
          
          return (
            <IconGrid
              key={categoryName}
              icons={icons}
              title={`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Icons (${Object.keys(icons).length})`}
              size={32}
              showNames={true}
            />
          );
        })}
      </div>
    );
  },
};

// 다양한 크기로 보여주는 스토리
export const IconSizes: Story = {
  render: () => {
    const icons = getAllIcons();
    const sampleIcons = Object.entries(icons).slice(0, 6); // 처음 6개 아이콘만 샘플로 사용
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Icon Sizes
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '30px',
          width: '100%'
        }}>
          {sampleIcons.map(([name, IconComponent]) => (
            <div key={name} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
                {name}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <IconComponent size={16} />
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>16px</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <IconComponent size={24} />
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>24px</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <IconComponent size={32} />
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>32px</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <IconComponent size={48} />
                  <span style={{ fontSize: '10px', color: '#6b7280' }}>48px</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// 색상 변형을 보여주는 스토리
export const ColorVariations: Story = {
  render: () => {
    const icons = getAllIcons();
    const sampleIcons = Object.entries(icons).slice(0, 8); // 처음 8개 아이콘만 샘플로 사용
    const colors = ['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];
    
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '40px', 
        alignItems: 'center',
        width: '100%',
        maxWidth: '1000px'
      }}>
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          Color Variations
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '30px',
          width: '100%'
        }}>
          {sampleIcons.map(([name, IconComponent]) => (
            <div key={name} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '16px',
              padding: '20px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#fafafa'
            }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>
                {name}
              </span>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '12px',
                width: '100%'
              }}>
                {colors.map((color) => (
                  <div key={color} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: '4px'
                  }}>
                    <IconComponent size={24} style={{ color }} />
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      backgroundColor: color, 
                      borderRadius: '50%',
                      border: '1px solid #d1d5db'
                    }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
};

// 카테고리별 아이콘 스토리들
export const BrandIcons: Story = {
  render: () => {
    const categories = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid
          icons={categories.brand}
          title="Brand Icons"
          size={32}
          showNames={true}
        />
      </div>
    );
  },
};

export const SemanticIcons: Story = {
  render: () => {
    const categories = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid
          icons={categories.semantic}
          title="Semantic Icons"
          size={32}
          showNames={true}
        />
      </div>
    );
  },
}; 