import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";
import { type FileItem, FileUploader } from "./file-uploader";

const meta = {
  title: "Components/FileUploader",
  component: FileUploader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    compact: { control: "boolean" },
    disabled: { control: "boolean" },
    maxFiles: { control: "number" },
    multiple: { control: "boolean" },
  },
  args: { files: [], onFilesChange: () => undefined },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Pinned files: a story must render the same bytes on every capture, so the
 * contents and timestamps are fixed rather than read from the clock.
 */
const pinned = (name: string, type: string): FileItem => {
  const file = new File(["cocso"], name, { lastModified: 0, type });
  return { file, name: file.name, size: file.size };
};

const Controlled = (
  props: Omit<
    ComponentProps<typeof FileUploader>,
    "files" | "onFilesChange"
  > & { initial?: FileItem[] }
) => {
  const { initial = [], ...rest } = props;
  const [files, setFiles] = useState<FileItem[]>(initial);
  return (
    <div style={{ maxWidth: "420px" }}>
      <FileUploader {...rest} files={files} onFilesChange={setFiles} />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <Controlled {...args} />,
};

/** One line, for an uploader that sits inside a table row. */
export const Compact: Story = {
  args: { compact: true },
  render: (args) => <Controlled {...args} />,
};

/** Chosen files are listed as `FileRow`s, each with a remove button. */
export const WithFiles: Story = {
  args: { maxFiles: 3 },
  render: (args) => (
    <Controlled
      {...args}
      initial={[pinned("사업자등록증.pdf", "application/pdf")]}
    />
  ),
};

/** The zone goes away once `maxFiles` is reached. */
export const Full: Story = {
  args: { maxFiles: 1, multiple: false },
  render: (args) => (
    <Controlled
      {...args}
      initial={[pinned("사업자등록증.pdf", "application/pdf")]}
    />
  ),
};

export const WithSizeHint: Story = {
  args: {
    accept: "image/png,image/jpeg",
    maxFiles: 1,
    maxSize: 2 * 1024 * 1024,
    multiple: false,
    sizeHint: "PNG 또는 JPG (최대 2 MB)",
  },
  render: (args) => <Controlled {...args} />,
};

/** While disabled only the hint stays, since it usually says why. */
export const Disabled: Story = {
  args: { disabled: true, sizeHint: "상단에서 정산제약사를 골라주세요." },
  render: (args) => <Controlled {...args} />,
};

/** Every word can be replaced. */
export const English: Story = {
  args: {
    messages: {
      compactPrompt: "Drop or click to add",
      maxSizeHint: (mb) => `(up to ${mb} MB)`,
      prompt: "Drop files here, or click to choose",
      rejectCount: (max) => `Up to ${max} files.`,
      rejectSize: (file, mb) => `${file.name} is larger than ${mb} MB.`,
      rejectType: (file) => `${file.name} is not an accepted type.`,
      remove: (name) => `Remove ${name}`,
    },
  },
  render: (args) => (
    <Controlled {...args} initial={[pinned("contract.pdf", "application/pdf")]} />
  ),
};
