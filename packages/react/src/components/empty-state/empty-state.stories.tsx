import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button";
import { Spinner } from "../spinner";
import { EmptyState } from "./empty-state";

const meta = {
  title: "Components/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  render: (args) => (
    <div style={{ width: "360px" }}>
      <EmptyState {...args} />
    </div>
  ),
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "등록된 품목이 없습니다" },
};

export const WithDescription: Story = {
  args: {
    title: "등록된 품목이 없습니다",
    description: "품목을 추가하면 이 그룹의 정산에서 제외됩니다.",
  },
};

export const WithAction: Story = {
  args: {
    title: "등록된 품목이 없습니다",
    description: "품목을 추가하면 이 그룹의 정산에서 제외됩니다.",
    action: (
      <Button size="small" variant="outline">
        품목 추가
      </Button>
    ),
  },
};

/** Loading uses the same frame, so the three states stand in the same place. */
export const Loading: Story = {
  args: {
    children: <Spinner label="불러오는 중" size="small" variant="secondary" />,
  },
};

export const Failed: Story = {
  args: {
    description: "목록을 불러오지 못했습니다. 잠시 뒤 다시 시도해주세요.",
  },
};
