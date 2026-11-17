import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SelectionChip } from "./selection-chip";

const meta = {
  title: "Components/SelectionChip",
  component: SelectionChip,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    active: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof SelectionChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "전체 선택" },
};

export const Active: Story = {
  args: { active: true, children: "전체 선택" },
};

export const Disabled: Story = {
  args: { children: "전체 선택", disabled: true },
};

/** The usual layout: a row of chips above a multi-select list. */
export const Group: Story = {
  args: { children: "전체 선택" },
  render: () => {
    const [selected, setSelected] = useState<Record<string, boolean>>({
      all: false,
      tagged: true,
      groupA: false,
    });
    const toggle = (key: string) =>
      setSelected((prev) => ({ ...prev, [key]: !prev[key] }));
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        <SelectionChip active={selected.all} onClick={() => toggle("all")}>
          전체 선택
        </SelectionChip>
        <SelectionChip
          active={selected.tagged}
          onClick={() => toggle("tagged")}
        >
          태그 있는 정산처 모두 선택
        </SelectionChip>
        <SelectionChip
          active={selected.groupA}
          onClick={() => toggle("groupA")}
        >
          A 그룹
        </SelectionChip>
      </div>
    );
  },
};
