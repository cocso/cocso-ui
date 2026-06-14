import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tooltip } from "./tooltip";

function renderTooltip() {
  return render(
    <Tooltip.Provider closeDelay={0} delay={0}>
      <Tooltip>
        <Tooltip.Trigger render={<button type="button">Hover me</button>} />
        <Tooltip.Content>
          <Tooltip.Arrow />
          Tooltip content
        </Tooltip.Content>
      </Tooltip>
    </Tooltip.Provider>
  );
}

describe("Tooltip", () => {
  describe("rendering", () => {
    it("renders the trigger inside Tooltip.Provider", () => {
      renderTooltip();

      expect(
        screen.getByRole("button", { name: "Hover me" })
      ).toBeInTheDocument();
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });

  describe("show/hide behavior", () => {
    it("shows the tooltip on hover and hides it on unhover", async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByRole("button", { name: "Hover me" });

      await user.hover(trigger);
      expect(await screen.findByText("Tooltip content")).toBeInTheDocument();
      expect(document.body).toHaveTextContent("Tooltip content");

      await user.unhover(trigger);

      await waitFor(() => {
        expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
      });
    });
  });

  describe("accessibility", () => {
    it("opens on focus and connects the trigger to the tooltip content", async () => {
      const user = userEvent.setup();
      renderTooltip();

      const trigger = screen.getByRole("button", { name: "Hover me" });

      await user.tab();
      expect(trigger).toHaveFocus();

      const tooltip = await screen.findByText("Tooltip content");

      expect(tooltip).toBeInTheDocument();
      expect(document.body).toHaveTextContent("Tooltip content");
      expect(screen.queryByRole("button", { name: "Hover me" })).toHaveFocus();
    });
  });
});
