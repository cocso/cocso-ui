import { render, screen } from "@testing-library/react";
import { Field, useField } from "./field";

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
      <Field htmlFor="name" label="이름">
        <input id="name" />
      </Field>
    );
    expect(screen.getByLabelText("이름")).toBeInTheDocument();
  });

  it('shows "(Optional)" when required=false', () => {
    render(
      <Field label="닉네임" required={false}>
        <input />
      </Field>
    );
    expect(screen.getByText("(Optional)")).toBeInTheDocument();
  });

  it("does not show optional indicator when required is undefined", () => {
    render(
      <Field label="이름">
        <input />
      </Field>
    );
    expect(screen.queryByText("(Optional)")).not.toBeInTheDocument();
  });

  it("shows error message when error prop is provided", () => {
    render(
      <Field error="올바른 이메일을 입력하세요" label="이메일">
        <input />
      </Field>
    );
    expect(screen.getByText("올바른 이메일을 입력하세요")).toBeInTheDocument();
  });

  it("shows description when no error", () => {
    render(
      <Field description="8자 이상 입력하세요" label="비밀번호">
        <input />
      </Field>
    );
    expect(screen.getByText("8자 이상 입력하세요")).toBeInTheDocument();
  });

  it("shows error over description when both provided", () => {
    render(
      <Field description="설명 텍스트" error="에러 메시지" label="이메일">
        <input />
      </Field>
    );
    expect(screen.getByText("에러 메시지")).toBeInTheDocument();
    expect(screen.queryByText("설명 텍스트")).not.toBeInTheDocument();
  });
});

describe("useField hook", () => {
  let capturedContext: ReturnType<typeof useField> = {};

  function ContextCapture() {
    capturedContext = useField();
    return null;
  }

  it("errorId matches the error <p> id when error prop is provided", () => {
    render(
      <Field error="에러" label="이메일">
        <ContextCapture />
      </Field>
    );
    const errorEl = screen.getByText("에러");
    expect(capturedContext.errorId).toBeDefined();
    expect(capturedContext.errorId).toBe(errorEl.id);
  });

  it("descriptionId matches the description <p> id when description prop is provided without error", () => {
    render(
      <Field description="설명" label="비밀번호">
        <ContextCapture />
      </Field>
    );
    const descEl = screen.getByText("설명");
    expect(capturedContext.descriptionId).toBeDefined();
    expect(capturedContext.descriptionId).toBe(descEl.id);
  });

  it("returns { descriptionId: undefined, errorId: undefined } when neither error nor description", () => {
    render(
      <Field label="이름">
        <ContextCapture />
      </Field>
    );
    expect(capturedContext.errorId).toBeUndefined();
    expect(capturedContext.descriptionId).toBeUndefined();
  });

  it("sets errorId and descriptionId is undefined when both error and description are provided", () => {
    render(
      <Field description="설명" error="에러" label="이메일">
        <ContextCapture />
      </Field>
    );
    expect(capturedContext.errorId).toBeDefined();
    expect(capturedContext.descriptionId).toBeUndefined();
  });
});
