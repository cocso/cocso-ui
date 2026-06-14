import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select } from "./select";

describe("Select", () => {
  describe("rendering", () => {
    it("renders as a select element", () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      );

      expect(
        screen.getByRole("combobox", { name: "Choose option" })
      ).toBeInTheDocument();
    });

    it("renders children options", () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      );

      expect(
        screen.getByRole("option", { name: "Option A" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Option B" })
      ).toBeInTheDocument();
    });

    it("is disabled when disabled=true", () => {
      render(
        <Select aria-label="Choose option" disabled>
          <option value="a">Option A</option>
        </Select>
      );

      expect(
        screen.getByRole("combobox", { name: "Choose option" })
      ).toBeDisabled();
    });

    it("forwards the name attribute", () => {
      render(
        <Select aria-label="Choose option" name="my-select">
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByRole("combobox")).toHaveAttribute("name", "my-select");
    });
  });

  describe("behavior", () => {
    it("calls onChange when value changes", async () => {
      const onChange = vi.fn();
      render(
        <Select aria-label="Choose option" onChange={onChange}>
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      );

      await userEvent.selectOptions(screen.getByRole("combobox"), "b");
      expect(onChange).toHaveBeenCalledOnce();
    });

    it("reflects the selected value", async () => {
      render(
        <Select aria-label="Choose option" defaultValue="a">
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      );

      await userEvent.selectOptions(screen.getByRole("combobox"), "b");
      expect(screen.getByRole("option", { name: "Option B" })).toHaveProperty(
        "selected",
        true
      );
    });

    it("does not change value when disabled", async () => {
      const onChange = vi.fn();
      render(
        <Select
          aria-label="Choose option"
          defaultValue="a"
          disabled
          onChange={onChange}
        >
          <option value="a">Option A</option>
          <option value="b">Option B</option>
        </Select>
      );

      await userEvent.selectOptions(screen.getByRole("combobox"), "b");
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("label integration", () => {
    it("wraps select in Field when label is provided", () => {
      render(
        <Select label="옵션">
          <option value="a">Option A</option>
        </Select>
      );
      expect(screen.getByText("옵션")).toBeInTheDocument();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("renders bare select without Field when label is omitted", () => {
      const { container } = render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
        </Select>
      );
      expect(container.querySelector("label")).not.toBeInTheDocument();
    });

    it("applies stretch class when stretch=true", () => {
      render(
        <Select aria-label="Choose option" data-testid="select" stretch>
          <option value="a">Option A</option>
        </Select>
      );
      expect(screen.getByTestId("select").closest("div")).toHaveClass(
        "stretch"
      );
    });
  });

  describe("error state", () => {
    it("sets aria-invalid=true on the select element when error=true", () => {
      render(
        <Select aria-label="Choose option" error>
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByRole("combobox")).toHaveAttribute(
        "aria-invalid",
        "true"
      );
    });

    it("does not set aria-invalid when error=false (default)", () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByRole("combobox")).not.toHaveAttribute("aria-invalid");
    });

    it("applies error class to wrapper when error=true", () => {
      render(
        <Select aria-label="Choose option" data-testid="select" error>
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByTestId("select").closest("div")).toHaveClass("error");
    });

    it("renders error message in Field when error is a string", () => {
      render(
        <Select error="필수 선택입니다" label="옵션">
          <option value="a">Option A</option>
        </Select>
      );
      expect(screen.getByText("필수 선택입니다")).toBeInTheDocument();
    });
  });

  describe("size className", () => {
    it.each([
      "x-small",
      "small",
      "medium",
      "large",
    ] as const)('applies size className for size="%s"', (size) => {
      render(
        <Select aria-label="Choose option" size={size}>
          <option value="a">Option A</option>
        </Select>
      );

      const wrapper = screen.getByRole("combobox").closest("div");
      expect(wrapper?.className).toContain(`cocso-select--size-${size}`);
    });

    it('applies default size "medium" className when no size prop is given', () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
        </Select>
      );

      const wrapper = screen.getByRole("combobox").closest("div");
      expect(wrapper?.className).toContain("cocso-select--size-medium");
    });
  });
});
