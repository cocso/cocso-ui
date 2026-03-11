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

  describe("size CSS variables", () => {
    it.each([
      ["small", "12px"],
      ["medium", "14px"],
      ["large", "14px"],
    ] as const)('sets --cocso-select-font-size for size="%s"', (size, expectedFontSize) => {
      render(
        <Select aria-label="Choose option" size={size}>
          <option value="a">Option A</option>
        </Select>
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveStyle({
        "--cocso-select-font-size": expectedFontSize,
      });
    });

    it('applies default size "medium" CSS variables when no size prop is given', () => {
      render(
        <Select aria-label="Choose option">
          <option value="a">Option A</option>
        </Select>
      );

      const select = screen.getByRole("combobox");
      expect(select).toHaveStyle({ "--cocso-select-font-size": "14px" });
    });
  });
});
