import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import { FormField, useFormField } from "./form-field";

async function axeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map((violation) => violation.id);
}

describe("FormField", () => {
  describe("rendering", () => {
    it("carries the override hooks", () => {
      const { container } = render(
        <FormField>
          <FormField.Label>이름</FormField.Label>
          <FormField.Value>홍길동</FormField.Value>
        </FormField>
      );
      for (const hook of [
        "form-field",
        "form-field-label",
        "form-field-value",
      ]) {
        expect(
          container.querySelector(`[data-cocso-component="${hook}"]`)
        ).toBeInTheDocument();
      }
    });

    it("applies the input recipe at the row's size", () => {
      const { container } = render(
        <FormField size="medium">
          <FormField.Label>이름</FormField.Label>
          <FormField.Input />
        </FormField>
      );
      const root = container.querySelector(
        '[data-cocso-component="form-field"]'
      ) as HTMLElement;
      expect(root.className).toContain("cocso-input--size-medium");
      expect(
        container.querySelector('[data-cocso-component="input"]')?.className
      ).toContain("cocso-input--size-medium");
    });

    it("defaults to the small size", () => {
      const { container } = render(
        <FormField>
          <FormField.Input aria-label="이름" />
        </FormField>
      );
      expect(
        container.querySelector('[data-cocso-component="input"]')?.className
      ).toContain("cocso-input--size-small");
    });
  });

  describe("label", () => {
    it("names the input without an htmlFor at the call site", () => {
      render(
        <FormField>
          <FormField.Label>이메일</FormField.Label>
          <FormField.Input type="email" />
        </FormField>
      );
      expect(screen.getByLabelText("이메일")).toHaveAttribute("type", "email");
    });

    it("keeps ids given by the caller", () => {
      render(
        <FormField>
          <FormField.Label htmlFor="custom">이름</FormField.Label>
          <input id="custom" />
        </FormField>
      );
      expect(screen.getByLabelText("이름")).toHaveAttribute("id", "custom");
    });

    it("gives two rows different ids", () => {
      render(
        <>
          <FormField>
            <FormField.Label>이름</FormField.Label>
            <FormField.Input />
          </FormField>
          <FormField>
            <FormField.Label>연락처</FormField.Label>
            <FormField.Input />
          </FormField>
        </>
      );
      expect(screen.getByLabelText("이름")).not.toBe(
        screen.getByLabelText("연락처")
      );
    });

    it("lets a second input in the row take its own id", () => {
      const { container } = render(
        <FormField>
          <FormField.Label>기간</FormField.Label>
          <FormField.Input />
          <FormField.Input aria-label="종료" id="end" />
        </FormField>
      );
      const ids = [...container.querySelectorAll("input")].map(
        (element) => element.id
      );
      expect(new Set(ids).size).toBe(2);
      expect(screen.getByLabelText("기간")).not.toHaveAttribute("id", "end");
    });

    it("hands the id to other controls through useFormField", () => {
      function Custom() {
        const field = useFormField();
        return <select id={field?.controlId} />;
      }
      render(
        <FormField>
          <FormField.Label>지역</FormField.Label>
          <Custom />
        </FormField>
      );
      expect(screen.getByLabelText("지역").tagName).toBe("SELECT");
    });

    it("marks required rows without putting the marker in the name", () => {
      const { container } = render(
        <FormField>
          <FormField.Label required>이름</FormField.Label>
          <FormField.Input required />
        </FormField>
      );
      expect(container.querySelector('[aria-hidden="true"]')).toHaveTextContent(
        "*"
      );
      expect(screen.getByRole("textbox", { name: "이름" })).toBeRequired();
    });

    it("turns a numeric width into pixels", () => {
      render(
        <FormField>
          <FormField.Label width={120}>이름</FormField.Label>
        </FormField>
      );
      expect(
        screen
          .getByText("이름")
          .style.getPropertyValue("--cocso-form-field-label-width")
      ).toBe("120px");
    });

    it("leaves the width to CSS when none is given", () => {
      render(
        <FormField>
          <FormField.Label>이름</FormField.Label>
        </FormField>
      );
      expect(
        screen
          .getByText("이름")
          .style.getPropertyValue("--cocso-form-field-label-width")
      ).toBe("");
    });
  });

  describe("input", () => {
    it("adds the reveal button to a password field", () => {
      render(
        <FormField>
          <FormField.Label>비밀번호</FormField.Label>
          <FormField.Input type="password" />
        </FormField>
      );
      expect(
        screen.getByRole("button", { name: "Show password" })
      ).toBeInTheDocument();
    });

    it("lets the reveal button be turned off", () => {
      render(
        <FormField>
          <FormField.Label>비밀번호</FormField.Label>
          <FormField.Input passwordToggle={false} type="password" />
        </FormField>
      );
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });
  });

  describe("input trigger", () => {
    it("is named by the label and its value together", () => {
      render(
        <FormField>
          <FormField.Label>시작월</FormField.Label>
          <FormField.InputTrigger value="2026-01" />
        </FormField>
      );
      expect(
        screen.getByRole("button", { name: "시작월 2026-01" })
      ).toBeInTheDocument();
    });

    it("prefers children over value", () => {
      render(
        <FormField>
          <FormField.Label>시작월</FormField.Label>
          <FormField.InputTrigger value="ignored">
            2026-02
          </FormField.InputTrigger>
        </FormField>
      );
      expect(screen.getByRole("button")).toHaveTextContent("2026-02");
    });

    it("shows the placeholder when there is no value", () => {
      render(
        <FormField>
          <FormField.Label>시작월</FormField.Label>
          <FormField.InputTrigger placeholder="월 선택" />
        </FormField>
      );
      expect(screen.getByRole("button")).toHaveTextContent("월 선택");
    });
  });

  describe("accessibility", () => {
    it("passes axe for a form of rows", async () => {
      const { container } = render(
        <div>
          <FormField>
            <FormField.Label required>이름</FormField.Label>
            <FormField.Input required />
          </FormField>
          <FormField>
            <FormField.Label>비밀번호</FormField.Label>
            <FormField.Input type="password" />
          </FormField>
          <FormField>
            <FormField.Label>시작월</FormField.Label>
            <FormField.InputTrigger placeholder="월 선택" />
          </FormField>
          <FormField>
            <FormField.Label>사업자등록번호</FormField.Label>
            <FormField.Value>123-45-67890</FormField.Value>
          </FormField>
        </div>
      );
      expect(await axeViolations(container)).toEqual([]);
    });
  });
});
