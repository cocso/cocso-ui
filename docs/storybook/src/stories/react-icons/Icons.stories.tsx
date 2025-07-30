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

const getAllIcons = () => {
  const icons: { [key: string]: React.ComponentType<IconProps> } = {};

  Object.entries(ReactIcons).forEach(([name, component]) => {
    if (typeof component === 'function' && name.endsWith('Icon') || name.endsWith('Logo')) {
      icons[name] = component as React.ComponentType<IconProps>;
    }
  });

  return icons;
};

const categorizeIcons = () => {
  const icons = getAllIcons();
  const categories: { [key: string]: { [key: string]: React.ComponentType<IconProps> } } = {
    brand: {},
    semantic: {},
    graphic: {},
    other: {}
  };

  // 실제 폴더 구조를 기반으로 한 분류 규칙
  // 각 폴더의 특성을 기반으로 분류
  Object.entries(icons).forEach(([name, component]) => {
    // Brand 폴더: 일반적인 로고들 (Vertical이 아닌 Logo들)
    if (name.includes('Logo') && !name.includes('Vertical')) {
      categories.brand[name] = component;
    }
    // Graphic 폴더: 특수한 그래픽 요소들 (Vertical Logo, Phone Icon 등)
    else if (name.includes('Vertical') || name.includes('Phone')) {
      categories.graphic[name] = component;
    }
    // Semantic 폴더: 의미론적 아이콘들 (일반적인 Icon들)
    else if (name.includes('Icon') && !name.includes('Phone')) {
      categories.semantic[name] = component;
    }
    // 기타: 분류되지 않은 아이콘들
    else {
      categories.other[name] = component;
    }
  });

  return categories;
};

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

export const IconSizes: Story = {
  render: () => {
    const icons = getAllIcons();
    const allIcons = Object.entries(icons);

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
          Icon Sizes ({allIcons.length} icons)
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          width: '100%'
        }}>
          {allIcons.map(([name, IconComponent]) => (
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
    const allIcons = Object.entries(icons);
    const colors = ['#000000', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

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
          Color Variations ({allIcons.length} icons)
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          width: '100%'
        }}>
          {allIcons.map(([name, IconComponent]) => (
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

export const GraphicIcons: Story = {
  render: () => {
    const categories = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid
          icons={categories.graphic}
          title="Graphic Icons"
          size={32}
          showNames={true}
        />
      </div>
    );
  },
};
