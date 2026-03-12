import { render, screen } from "@testing-library/react";
import { Field } from "./field";

describe("Field", () => {
  it("renders label text", () => {
    render(
      <Field label="이름">
        <input id="name" />
      </Field>
    );
    expect(screen.getByText("이름")).toBeInTheDocument();
  });

  it("connects label to input via htmlFor", () => {
    render(
      <Field label="이름" htmlFor="name">
        <input id="name" />
      </Field>
    );
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
  });

  it('shows "(선택)" when required=false', () => {
    render(
      <Field label="닉네임" required={false}>
        <input />
      </Field>
    );
    expect(screen.getByText("(선택)")).toBeInTheDocument();
  });

  it("does not show optional indicator when required is undefined", () => {
    render(
      <Field label="이름">
        <input />
      </Field>
    );
    expect(screen.queryByText("(선택)")).not.toBeInTheDocument();
  });

  it("shows error message when error prop is provided", () => {
    render(
      <Field label="이메일" error="올바른 이메일을 입력하세요">
        <input />
      </Field>
    );
    expect(screen.getByText("올바른 이메일을 입력하세요")).toBeInTheDocument();
  });

  it("shows description when no error", () => {
    render(
      <Field label="비밀번호" description="8자 이상 입력하세요">
        <input />
      </Field>
    );
    expect(screen.getByText("8자 이상 입력하세요")).toBeInTheDocument();
  });

  it("shows error over description when both provided", () => {
    render(
      <Field label="이메일" error="에러 메시지" description="설명 텍스트">
        <input />
      </Field>
    );
    expect(screen.getByText("에러 메시지")).toBeInTheDocument();
    expect(screen.queryByText("설명 텍스트")).not.toBeInTheDocument();
  });
});
