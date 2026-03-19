import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input";
import { Select } from "../select";
import { Field } from "./field";

const meta = {
  title: "Components/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    label: "라벨",
    children: <input />,
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithInput: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "300px" }}>
      <Input label="이름" placeholder="이름을 입력하세요" stretch />
      <Input label="이메일" placeholder="이메일을 입력하세요" stretch />
      <Input
        label="비밀번호"
        type="password"
        description="8자 이상 입력하세요"
        placeholder="비밀번호"
        stretch
      />
      <Input
        label="이메일 확인"
        error="이메일 형식이 올바르지 않습니다"
        placeholder="이메일"
        stretch
      />
      <Input label="닉네임" required={false} placeholder="선택 입력" stretch />
    </div>
  ),
};

export const WithSelect: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "300px" }}>
      <Select label="카테고리" stretch>
        <option value="1">옵션 1</option>
        <option value="2">옵션 2</option>
      </Select>
      <Select label="지역" required={false} stretch>
        <option value="1">서울</option>
        <option value="2">부산</option>
      </Select>
      <Select label="배송 방법" error="배송 방법을 선택해주세요" stretch>
        <option value="">선택하세요</option>
        <option value="1">일반 배송</option>
      </Select>
    </div>
  ),
};
