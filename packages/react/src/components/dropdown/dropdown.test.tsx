import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Dropdown } from "./dropdown";

describe("Dropdown", () => {
  describe("rendering", () => {
    it("renders the trigger button", () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      expect(
        screen.getByRole("button", { name: "Open Menu" })
      ).toBeInTheDocument();
    });

    it("does not show content before the trigger is clicked", () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Item 1</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      expect(
        screen.queryByRole("menuitem", { name: "Item 1" })
      ).not.toBeInTheDocument();
    });
  });

  describe("open/close behavior", () => {
    it("opens the dropdown and shows items when trigger is clicked", async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Item 1</Dropdown.Item>
            <Dropdown.Item>Item 2</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      await expect(
        screen.findByRole("menuitem", { name: "Item 1" })
      ).resolves.toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Item 2" })
      ).toBeInTheDocument();
    });

    it("renders the dropdown menu in document.body via Portal", async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Portal Item</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      const item = await screen.findByRole("menuitem", { name: "Portal Item" });
      expect(document.body).toContainElement(item);
    });
  });

  describe("item interactions", () => {
    it("renders a prefixed item inside the menuitem", async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item
              prefix={
                <span aria-hidden="true" data-testid="item-prefix">
                  ★
                </span>
              }
            >
              Prefixed Action
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      const item = await screen.findByRole("menuitem", {
        name: "Prefixed Action",
      });
      expect(item).toContainElement(screen.getByTestId("item-prefix"));
    });

    it("calls onClick handler when an item is clicked", async () => {
      const onClick = vi.fn();
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item onClick={onClick}>Action</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      const item = await screen.findByRole("menuitem", { name: "Action" });
      await userEvent.click(item);
      expect(onClick).toHaveBeenCalledOnce();
    });

    it("does not call onClick or close the menu when an item is disabled", async () => {
      const onClick = vi.fn();

      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item disabled onClick={onClick}>
              Disabled Action
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );

      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      const item = await screen.findByRole("menuitem", {
        name: "Disabled Action",
      });

      expect(item).toHaveAttribute("aria-disabled", "true");

      await userEvent.click(item);

      expect(onClick).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(
          screen.getByRole("menuitem", { name: "Disabled Action" })
        ).toBeInTheDocument();
      });
    });

    it("closes the dropdown after an item is selected", async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Close Me</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      const item = await screen.findByRole("menuitem", { name: "Close Me" });
      await userEvent.click(item);
      await waitFor(() => {
        expect(
          screen.queryByRole("menuitem", { name: "Close Me" })
        ).not.toBeInTheDocument();
      });
    });

    it("renders multiple items and each is accessible", async () => {
      render(
        <Dropdown>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Edit</Dropdown.Item>
            <Dropdown.Item>Delete</Dropdown.Item>
            <Dropdown.Item>Share</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      await expect(
        screen.findByRole("menuitem", { name: "Edit" })
      ).resolves.toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Delete" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Share" })
      ).toBeInTheDocument();
    });
  });

  describe("controlled state", () => {
    it("respects onOpenChange callback", async () => {
      const onOpenChange = vi.fn();
      render(
        <Dropdown onOpenChange={onOpenChange}>
          <Dropdown.Trigger render={<button type="button">Open Menu</button>} />
          <Dropdown.Content>
            <Dropdown.Item>Item</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      );
      await userEvent.click(screen.getByRole("button", { name: "Open Menu" }));
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      });
    });
  });
});
