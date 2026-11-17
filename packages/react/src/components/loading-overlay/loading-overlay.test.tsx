import { render, screen } from "@testing-library/react";

import { LoadingOverlay } from "./loading-overlay";

describe("LoadingOverlay", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<LoadingOverlay open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("carries the override hook and marks itself busy", () => {
    const { container } = render(<LoadingOverlay open />);
    const overlay = container.querySelector(
      '[data-cocso-component="loading-overlay"]'
    );
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute("aria-busy", "true");
  });

  it("shows the default message", () => {
    render(<LoadingOverlay open />);
    expect(screen.getByText("처리 중입니다")).toBeInTheDocument();
  });

  /** The spinner is the single live region, and the message names it. */
  it("names the live region with the message", () => {
    render(<LoadingOverlay message="업로드 중" open />);
    const status = screen.getByRole("status");
    expect(status).toHaveAccessibleName("업로드 중");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("renders the description", () => {
    render(<LoadingOverlay description="창을 닫지 마세요." open />);
    expect(screen.getByText("창을 닫지 마세요.")).toBeInTheDocument();
  });

  it("merges className", () => {
    const { container } = render(<LoadingOverlay className="extra" open />);
    expect(
      container.querySelector('[data-cocso-component="loading-overlay"]')
        ?.className
    ).toContain("extra");
  });
});
