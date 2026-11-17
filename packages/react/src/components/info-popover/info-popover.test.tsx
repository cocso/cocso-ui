import { act, fireEvent, render, screen } from "@testing-library/react";
import axe from "axe-core";
import { InfoPopover } from "./info-popover";

async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe("InfoPopover", () => {
  describe("trigger", () => {
    it("is a button named by its label", () => {
      render(<InfoPopover label="합산 기준">설명</InfoPopover>);
      expect(
        screen.getByRole("button", { name: "합산 기준" })
      ).toBeInTheDocument();
    });

    it("has an English default name", () => {
      render(<InfoPopover>설명</InfoPopover>);
      expect(
        screen.getByRole("button", { name: "More information" })
      ).toBeInTheDocument();
    });

    it("carries the override hook", () => {
      const { container } = render(<InfoPopover>설명</InfoPopover>);
      expect(
        container.querySelector('[data-cocso-component="info-popover-trigger"]')
      ).toBeInTheDocument();
    });

    it("keeps the panel closed until pressed", () => {
      render(<InfoPopover>설명</InfoPopover>);
      expect(screen.queryByText("설명")).not.toBeInTheDocument();
    });

    it("opens the panel when pressed", async () => {
      render(<InfoPopover>설명</InfoPopover>);
      fireEvent.click(screen.getByRole("button"));
      await settle();
      expect(screen.getByText("설명")).toBeInTheDocument();
    });
  });

  describe("panel", () => {
    it("is a dialog named by the label", async () => {
      render(
        <InfoPopover defaultOpen label="합산 기준">
          설명
        </InfoPopover>
      );
      await settle();
      expect(
        screen.getByRole("dialog", { name: "합산 기준" })
      ).toHaveTextContent("설명");
    });

    it("keeps Popover's override hooks", async () => {
      render(<InfoPopover defaultOpen>설명</InfoPopover>);
      await settle();
      expect(
        document.querySelector('[data-cocso-component="popover-content"]')
      ).toBeInTheDocument();
      expect(
        document.querySelector('[data-cocso-component="popover-positioner"]')
      ).toBeInTheDocument();
    });

    it("defaults to 300px wide", async () => {
      render(<InfoPopover defaultOpen>설명</InfoPopover>);
      await settle();
      expect(
        screen
          .getByRole("dialog")
          .style.getPropertyValue("--cocso-info-popover-width")
      ).toBe("300px");
    });

    it("takes a width", async () => {
      render(
        <InfoPopover defaultOpen width="20rem">
          설명
        </InfoPopover>
      );
      await settle();
      expect(
        screen
          .getByRole("dialog")
          .style.getPropertyValue("--cocso-info-popover-width")
      ).toBe("20rem");
    });

    it("reports open changes", async () => {
      const onOpenChange = vi.fn();
      render(<InfoPopover onOpenChange={onOpenChange}>설명</InfoPopover>);
      fireEvent.click(screen.getByRole("button"));
      await settle();
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });
  });

  describe("accessibility", () => {
    it("passes axe open, scoped to the document", async () => {
      const { unmount } = render(
        <InfoPopover defaultOpen label="합산 기준">
          설명
        </InfoPopover>
      );
      await settle();
      const results = await axe.run(
        { exclude: [["[data-base-ui-focus-guard]"]], include: [["body"]] },
        {
          rules: {
            "color-contrast": { enabled: false },
            region: { enabled: false },
          },
        }
      );
      unmount();
      expect(results.violations.map((violation) => violation.id)).toEqual([]);
    });
  });
});
