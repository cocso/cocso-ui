import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { OneTimePasswordField } from '@cocso-ui/react';

const meta = {
  title: 'React/OneTimePasswordField',
  component: OneTimePasswordField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
    },
    autoFocus: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof OneTimePasswordField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange}>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const SixDigits: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange}>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const FourDigits: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange}>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const EightDigits: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange}>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange} disabled>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const AutoFocus: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    const handleChange = (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValue(target.value);
    };
    
    return (
      <OneTimePasswordField value={value} onChange={handleChange} autoFocus>
        <OneTimePasswordField.Input />
      </OneTimePasswordField>
    );
  },
};

export const AllVariations: Story = {
  render: () => {
    const [values, setValues] = useState({
      default: '',
      disabled: '',
    });

    const handleChange = (key: string) => (event: React.FormEvent<HTMLDivElement>) => {
      const target = event.target as HTMLInputElement;
      setValues(prev => ({ ...prev, [key]: target.value }));
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Basic Usage */}
        <div>
          <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: '600' }}>Basic Usage</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                기본 OTP 필드
              </label>
              <OneTimePasswordField
                value={values.default}
                onChange={handleChange('default')}
              >
                <OneTimePasswordField.Input />
              </OneTimePasswordField>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                비활성화된 OTP 필드
              </label>
              <OneTimePasswordField
                value={values.disabled}
                onChange={handleChange('disabled')}
                disabled
              >
                <OneTimePasswordField.Input />
              </OneTimePasswordField>
            </div>
          </div>
        </div>
      </div>
    );
  },
}; 