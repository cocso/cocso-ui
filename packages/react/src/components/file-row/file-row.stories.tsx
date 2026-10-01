import type { Meta, StoryObj } from '@storybook/react';
import { DeleteIcon, DownloadIcon, PrinterIcon } from '@cocso-ui/react-icons';
import { Button } from '../button';
import { Input } from '../input';
import { FileRow } from './file-row';

const meta = {
  title: 'Components/FileRow',
  component: FileRow,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    disabled: { control: 'boolean' },
    error: { control: 'boolean' },
    stretch: { control: 'boolean' },
  },
} satisfies Meta<typeof FileRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const actions = (
  <>
    <Button aria-label="인쇄" size="x-small" svgOnly variant="ghost">
      <PrinterIcon size={14} />
    </Button>
    <Button aria-label="다운로드" size="x-small" svgOnly variant="ghost">
      <DownloadIcon size={14} />
    </Button>
    <Button aria-label="삭제" size="x-small" svgOnly variant="ghost">
      <DeleteIcon size={14} />
    </Button>
  </>
);

export const Default: Story = {
  args: { name: '사업자등록증.pdf' },
};

export const WithActions: Story = {
  args: { actions, name: '사업자등록증.pdf' },
};

export const AsLink: Story = {
  args: { actions, href: '#preview', name: '사업자등록증.pdf' },
};

/** The name truncates rather than wrapping — the row keeps the field's height. */
export const LongName: Story = {
  args: {
    actions,
    name: '2026년-1분기-위수탁계약서-변경분-서명본-최종-v3.pdf',
    stretch: true,
  },
  render: args => (
    <div style={{ width: '320px' }}>
      <FileRow {...args} />
    </div>
  ),
};

export const Error: Story = {
  args: { actions, error: true, name: '만료된-증서.pdf' },
};

export const Disabled: Story = {
  args: { actions, disabled: true, href: '#preview', name: '사업자등록증.pdf' },
};

/**
 * The reason the component exists: the row and the field start their text on
 * the same line and stand the same height, because both read the `input`
 * recipe instead of a measurement.
 */
export const BesideAnInput: Story = {
  args: { name: '사업자등록증.pdf' },
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '320px' }}>
      <Input aria-label="상호" defaultValue="코크소" size="small" stretch />
      <FileRow {...args} actions={actions} stretch />
    </div>
  ),
};
