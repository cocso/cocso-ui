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

  describe("error state", () => {
    it("sets aria-invalid=true on the select element when error=true", () => {
      render(
        <Select aria-label="Choose option" error>
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true");
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
        <Select aria-label="Choose option" error data-testid="select">
          <option value="a">Option A</option>
        </Select>
      );

      expect(screen.getByTestId("select").closest("div")).toHaveClass("error");
    });
  });

  describe("size CSS variables", () => {
    it.each([
      ["x-small", "12px"],
      ["small", "12px"],
      ["medium", "14px"],
      ["large", "14px"],
    ] as const)('sets --cocso-select-font-size for size="%s"', (size, expectedFontSize) => {
      render(
        <Select aria-label="Choose option" size={size}>
          <option value="a">Option A</option>
        </Select>
      );

      const wrapper = screen.getByRole("combobox").closest("div")!;
      expect(wrapper).toHaveStyle({
        "--cocso-select-font-size": expectedFontSize,
      });
    });

    it('applies default size "medium" CSS variables when no size prop is given', () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
        </Select>
      );

      const wrapper = screen.getByRole("combobox").closest("div")!;
      expect(wrapper).toHaveStyle({ "--cocso-select-font-size": "14px" });
    });

    it.each([
      ["x-small", "28px"],
      ["small", "32px"],
      ["medium", "36px"],
      ["large", "40px"],
    ] as const)('sets --cocso-select-height for size="%s"', (size, expectedHeight) => {
      render(
        <Select aria-label="Choose option" size={size}>
          <option value="a">Option A</option>
        </Select>
      );

      const wrapper = screen.getByRole("combobox").closest("div")!;
      expect(wrapper).toHaveStyle({
        "--cocso-select-height": expectedHeight,
      });
    });
  });
});
