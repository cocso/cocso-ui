import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { SectionHeader } from "./section-header";

/**
 * jsdom lays nothing out, so every width is 0 and the header always looks too
 * narrow. Each state is set up on purpose instead of falling out of that.
 */
function setHeaderWidth(width: number) {
  return vi
    .spyOn(HTMLElement.prototype, "clientWidth", "get")
    .mockReturnValue(width);
}

const actions = (
  <button onClick={() => undefined} type="button">
    추가
  </button>
);

async function axeViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  return results.violations.map((violation) => violation.id);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("SectionHeader", () => {
  describe("rendering", () => {
    it("renders the title as a level-2 heading by default", () => {
      render(<SectionHeader title="의약품 관리" />);
      expect(
        screen.getByRole("heading", { level: 2, name: "의약품 관리" })
      ).toBeInTheDocument();
    });

    it("takes another heading level", () => {
      render(<SectionHeader level={3} title="의약품 관리" />);
      expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
    });

    it("applies titleClassName to the title", () => {
      render(<SectionHeader title="제목" titleClassName="truncate" />);
      expect(screen.getByRole("heading")).toHaveClass("truncate");
    });

    it("renders the description", () => {
      render(<SectionHeader description="설명" title="제목" />);
      expect(screen.getByText("설명")).toBeInTheDocument();
    });

    it("carries the override hooks", () => {
      setHeaderWidth(1000);
      const { container } = render(
        <SectionHeader actions={actions} title="제목" />
      );
      expect(
        container.querySelector('[data-cocso-component="section-header"]')
      ).toBeInTheDocument();
      expect(
        container.querySelector(
          '[data-cocso-component="section-header-actions"]'
        )
      ).toBeInTheDocument();
    });
  });

  describe("with room", () => {
    it("shows the actions inline and no toggle", () => {
      setHeaderWidth(1000);
      render(<SectionHeader actions={actions} title="제목" />);
      expect(screen.getByRole("button", { name: "추가" })).toBeVisible();
      expect(
        screen.queryByRole("button", { name: "More" })
      ).not.toBeInTheDocument();
    });
  });

  describe("without room", () => {
    it("collapses the actions behind a toggle", () => {
      setHeaderWidth(100);
      render(<SectionHeader actions={actions} title="제목" />);
      const toggle = screen.getByRole("button", { name: "More" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByRole("button", { name: "추가" })).toBeNull();
    });

    it("takes a localized toggle label", () => {
      setHeaderWidth(100);
      render(
        <SectionHeader actions={actions} moreLabel="더보기" title="제목" />
      );
      expect(
        screen.getByRole("button", { name: "더보기" })
      ).toBeInTheDocument();
    });

    it("opens and closes the panel from the toggle", () => {
      setHeaderWidth(100);
      render(<SectionHeader actions={actions} title="제목" />);
      const toggle = screen.getByRole("button", { name: "More" });
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      const action = screen.getByRole("button", { name: "추가" });
      expect(toggle.getAttribute("aria-controls")).toBe(
        action.parentElement?.id
      );
      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("keeps the actions mounted while closed", () => {
      setHeaderWidth(100);
      render(<SectionHeader actions={actions} title="제목" />);
      expect(
        screen.getByRole("button", { hidden: true, name: "추가" })
      ).toBeInTheDocument();
    });

    it("closes on an outside click but not on a click inside", () => {
      setHeaderWidth(100);
      render(<SectionHeader actions={actions} title="제목" />);
      const toggle = screen.getByRole("button", { name: "More" });
      fireEvent.click(toggle);
      fireEvent.click(screen.getByRole("button", { name: "추가" }));
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      fireEvent.click(document.body);
      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("closes on Escape and returns focus to the toggle", () => {
      setHeaderWidth(100);
      render(
        <SectionHeader actions={actions} defaultActionsOpen title="제목" />
      );
      const toggle = screen.getByRole("button", { name: "More" });
      expect(toggle).toHaveAttribute("aria-expanded", "true");
      fireEvent.keyDown(document, { key: "Escape" });
      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle).toHaveFocus();
    });

    it("forgets the open panel once it widens", () => {
      const callbacks: (() => void)[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            callbacks.push(callback);
          }
          observe() {
            return;
          }
          disconnect() {
            return;
          }
        }
      );
      const width = setHeaderWidth(100);
      render(
        <SectionHeader actions={actions} defaultActionsOpen title="제목" />
      );
      expect(screen.getByRole("button", { name: "More" })).toHaveAttribute(
        "aria-expanded",
        "true"
      );
      const resize = () =>
        act(() => {
          for (const callback of callbacks) {
            callback();
          }
        });
      width.mockReturnValue(1000);
      resize();
      expect(screen.queryByRole("button", { name: "More" })).toBeNull();
      width.mockReturnValue(100);
      resize();
      expect(screen.getByRole("button", { name: "More" })).toHaveAttribute(
        "aria-expanded",
        "false"
      );
      vi.unstubAllGlobals();
    });

    it("stays inline when collapsing is turned off", () => {
      setHeaderWidth(100);
      render(
        <SectionHeader actions={actions} collapsible={false} title="제목" />
      );
      expect(screen.queryByRole("button", { name: "More" })).toBeNull();
      expect(screen.getByRole("button", { name: "추가" })).toBeVisible();
    });
  });

  describe("accessibility", () => {
    it("passes axe inline", async () => {
      setHeaderWidth(1000);
      const { container } = render(
        <SectionHeader actions={actions} description="설명" title="제목" />
      );
      expect(await axeViolations(container)).toEqual([]);
    });

    it("passes axe collapsed and open", async () => {
      setHeaderWidth(100);
      const { container } = render(
        <SectionHeader actions={actions} defaultActionsOpen title="제목" />
      );
      expect(await axeViolations(container)).toEqual([]);
    });
  });
});
