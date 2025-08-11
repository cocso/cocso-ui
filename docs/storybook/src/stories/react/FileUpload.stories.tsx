import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { FileUpload } from '@cocso-ui/react';

interface FileObject {
  file: File;
  name: string;
  size: number;
}

const meta = {
  title: 'react/file-upload',
  component: FileUpload,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    maxFiles: {
      control: 'number',
      description: '최대 업로드 가능한 파일 수',
    },
    accept: {
      control: 'text',
      description: '허용할 파일 타입 (예: image/*, .pdf,.doc)',
    },
    multiple: {
      control: 'boolean',
      description: '다중 파일 선택 허용',
    },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    files: [],
    onFilesChange: () => {},
    maxFiles: 3,
  },
  render: (args) => {
    const [files, setFiles] = useState<FileObject[]>([]);

    return (
      <div style={{ width: '400px' }}>
        <FileUpload
          {...args}
          files={files}
          onFilesChange={setFiles}
          onRemove={(fileName: string) => {
            console.log('파일 제거:', fileName);
          }}
        />
      </div>
    );
  },
};

export const ImageOnly: Story = {
  args: {
    files: [],
    onFilesChange: () => {},
    accept: 'image/*',
    maxFiles: 5,
  },
  render: (args) => {
    const [files, setFiles] = useState<FileObject[]>([]);

    return (
      <div style={{ width: '400px' }}>
        <FileUpload
          {...args}
          files={files}
          onFilesChange={setFiles}
          onRemove={(fileName: string) => {
            console.log('이미지 제거:', fileName);
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          이미지 파일만 허용됩니다.
        </p>
      </div>
    );
  },
};

export const SingleFile: Story = {
  args: {
    files: [],
    onFilesChange: () => {},
    maxFiles: 1,
    multiple: false,
    accept: '.pdf,.doc,.docx',
  },
  render: (args) => {
    const [files, setFiles] = useState<FileObject[]>([]);

    return (
      <div style={{ width: '400px' }}>
        <FileUpload
          {...args}
          files={files}
          onFilesChange={setFiles}
          onRemove={(fileName: string) => {
            console.log('문서 제거:', fileName);
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          PDF, DOC, DOCX 파일만 허용됩니다.
        </p>
      </div>
    );
  },
};

export const DocumentTypes: Story = {
  args: {
    files: [],
    onFilesChange: () => {},
    accept: '.pdf,.doc,.docx,.txt',
    maxFiles: 2,
  },
  render: (args) => {
    const [files, setFiles] = useState<FileObject[]>([]);

    return (
      <div style={{ width: '400px' }}>
        <FileUpload
          {...args}
          files={files}
          onFilesChange={setFiles}
          onRemove={(fileName: string) => {
            console.log('문서 제거:', fileName);
          }}
        />
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
          PDF, DOC, DOCX, TXT 파일만 허용됩니다.
        </p>
      </div>
    );
  },
}; 