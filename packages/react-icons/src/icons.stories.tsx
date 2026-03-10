import type { Meta, StoryObj } from '@storybook/react';
import type { SVGAttributes } from 'react';
import * as ReactIcons from '.';

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
};

export default meta;
type Story = StoryObj;

const getAllIcons = () => {
  const icons: { [key: string]: React.ComponentType<IconProps> } = {};

  Object.entries(ReactIcons).forEach(([name, component]) => {
    if ((typeof component === 'function' && name.endsWith('Icon')) || name.endsWith('Logo')) {
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
    other: {},
  };

  Object.entries(icons).forEach(([name, component]) => {
    if (name.includes('Logo') && !name.includes('Vertical')) {
      categories.brand[name] = component;
    } else if (name.includes('Vertical') || name.includes('Phone')) {
      categories.graphic[name] = component;
    } else if (name.includes('Icon') && !name.includes('Phone')) {
      categories.semantic[name] = component;
    } else {
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
}: {
  icons: { [key: string]: React.ComponentType<IconProps> };
  title: string;
  size?: number;
  showNames?: boolean;
}) => (
  <div style={{ marginBottom: '40px' }}>
    <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: 'bold' }}>{title}</h3>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '20px',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      {Object.entries(icons).map(([name, IconComponent]) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            backgroundColor: '#fafafa',
          }}
        >
          <IconComponent size={size} />
          {showNames && (
            <span
              style={{
                fontSize: '12px',
                textAlign: 'center',
                color: '#6b7280',
                wordBreak: 'break-word',
                lineHeight: '1.2',
              }}
            >
              {name}
            </span>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const AllIcons: Story = {
  render: () => {
    const categories = categorizeIcons();
    const total = Object.values(categories).reduce((acc, cat) => acc + Object.keys(cat).length, 0);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '1200px',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>
          All React Icons ({total} total)
        </h2>
        {Object.entries(categories).map(([categoryName, icons]) => {
          if (Object.keys(icons).length === 0) return null;
          return (
            <IconGrid
              icons={icons}
              key={categoryName}
              showNames={true}
              size={32}
              title={`${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Icons (${Object.keys(icons).length})`}
            />
          );
        })}
      </div>
    );
  },
};

export const BrandIcons: Story = {
  render: () => {
    const { brand } = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid icons={brand} showNames={true} size={32} title="Brand Icons" />
      </div>
    );
  },
};

export const SemanticIcons: Story = {
  render: () => {
    const { semantic } = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid icons={semantic} showNames={true} size={32} title="Semantic Icons" />
      </div>
    );
  },
};

export const GraphicIcons: Story = {
  render: () => {
    const { graphic } = categorizeIcons();
    return (
      <div style={{ width: '100%', maxWidth: '1200px' }}>
        <IconGrid icons={graphic} showNames={true} size={32} title="Graphic Icons" />
      </div>
    );
  },
};
