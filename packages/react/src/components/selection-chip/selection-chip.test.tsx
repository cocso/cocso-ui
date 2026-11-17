import { fireEvent, render, screen } from "@testing-library/react";

import { SelectionChip } from "./selection-chip";

describe("SelectionChip", () => {
  it("renders a button with its label", () => {
    render(<SelectionChip>전체 선택</SelectionChip>);
    const chip = screen.getByRole("button", { name: "전체 선택" });
    expect(chip).toHaveAttribute("type", "button");
  });

  it("carries the override hook", () => {
    render(<SelectionChip>전체 선택</SelectionChip>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-cocso-component",
      "selection-chip"
    );
  });

  /** The active state must not be colour-only. */
  it("exposes the active state as aria-pressed", () => {
    const { rerender } = render(<SelectionChip>전체 선택</SelectionChip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
    rerender(<SelectionChip active>전체 선택</SelectionChip>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button")).toHaveAttribute("data-active", "true");
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<SelectionChip onClick={onClick}>전체 선택</SelectionChip>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <SelectionChip disabled onClick={onClick}>
        전체 선택
      </SelectionChip>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges className", () => {
    render(<SelectionChip className="extra">전체 선택</SelectionChip>);
    expect(screen.getByRole("button").className).toContain("extra");
  });
});
