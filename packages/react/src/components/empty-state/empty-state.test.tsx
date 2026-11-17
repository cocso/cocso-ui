import { render, screen } from "@testing-library/react";

import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState description="품목을 추가해주세요." title="품목이 없습니다" />
    );
    expect(screen.getByText("품목이 없습니다")).toBeInTheDocument();
    expect(screen.getByText("품목을 추가해주세요.")).toBeInTheDocument();
  });

  it("carries the override hook", () => {
    const { container } = render(<EmptyState title="없음" />);
    expect(
      container.querySelector('[data-cocso-component="empty-state"]')
    ).toBeInTheDocument();
  });

  it("renders the action", () => {
    render(
      <EmptyState
        action={<button type="button">추가</button>}
        title="품목이 없습니다"
      />
    );
    expect(screen.getByRole("button", { name: "추가" })).toBeInTheDocument();
  });

  it("renders children before the title", () => {
    const { container } = render(
      <EmptyState title="제목">
        <span data-testid="lead">lead</span>
      </EmptyState>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.firstElementChild).toBe(screen.getByTestId("lead"));
  });

  it("renders nothing for omitted parts", () => {
    const { container } = render(<EmptyState />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.childElementCount).toBe(0);
  });

  it("forwards div props", () => {
    render(<EmptyState data-testid="empty" id="empty-1" title="없음" />);
    expect(screen.getByTestId("empty")).toHaveAttribute("id", "empty-1");
  });
});
