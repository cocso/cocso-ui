import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dialog } from "./dialog";

describe("Dialog", () => {
  describe("trigger rendering", () => {
    it("renders the trigger button", () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
        </Dialog>
      );
      expect(screen.getByRole("button", { name: "Open" })).toBeInTheDocument();
    });

    it("does not show dialog content before trigger is clicked", () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>My Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("open / close behavior", () => {
    it("opens the dialog when trigger is clicked", async () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders title and description inside the dialog", async () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>My Title</Dialog.Title>
            <Dialog.Description>My Description</Dialog.Description>
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("My Title")).toBeInTheDocument();
      expect(screen.getByText("My Description")).toBeInTheDocument();
    });

    it("closes the dialog when the close button is clicked", async () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
            <Dialog.Close aria-label="Close dialog" />
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: "Close dialog" })
      );
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes the dialog when Escape key is pressed", async () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>Dialog Title</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByRole("dialog")).toBeInTheDocument();

      await userEvent.keyboard("{Escape}");
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  describe("controlled mode", () => {
    it("calls onOpenChange when dialog open state changes", async () => {
      const onOpenChange = vi.fn();
      render(
        <Dialog onOpenChange={onOpenChange}>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });
  });

  describe("Dialog.Close with render", () => {
    it("renders a custom close element via render prop", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Dialog</Dialog.Title>
            <Dialog.Close
              render={<button type="button">Custom Close</button>}
            />
          </Dialog.Content>
        </Dialog>
      );
      expect(
        screen.getByRole("button", { name: "Custom Close" })
      ).toBeInTheDocument();
    });
  });

  describe("portal rendering", () => {
    it("renders dialog content in the document body via portal", async () => {
      render(
        <Dialog>
          <Dialog.Trigger render={<button type="button">Open</button>} />
          <Dialog.Content>
            <Dialog.Title>Portal Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open" }));
      const dialog = screen.getByRole("dialog");
      expect(document.body.contains(dialog)).toBeTruthy();
    });
  });

  describe("size variants", () => {
    it("renders with small size", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content size="small">
            <Dialog.Title>Small Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with medium size by default", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content>
            <Dialog.Title>Medium Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("renders with large size", () => {
      render(
        <Dialog defaultOpen>
          <Dialog.Content size="large">
            <Dialog.Title>Large Dialog</Dialog.Title>
          </Dialog.Content>
        </Dialog>
      );
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
