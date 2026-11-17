import { render, screen } from "@testing-library/react";
import axe from "axe-core";
import type { ComponentProps } from "react";
import { SummaryCard } from "./summary-card";

describe("SummaryCard", () => {
  describe("root", () => {
    it("renders the label and the children", () => {
      render(
        <SummaryCard label="총 CSO사 수">
          <SummaryCard.Value count={128} />
        </SummaryCard>
      );
      expect(screen.getByText("총 CSO사 수")).toBeInTheDocument();
      expect(screen.getByText("128")).toBeInTheDocument();
    });

    it("hides the icon from assistive technology", () => {
      const { container } = render(
        <SummaryCard icon={<svg data-testid="icon" />} label="라벨" />
      );
      expect(
        container.querySelector('[data-testid="icon"]')?.parentElement
      ).toHaveAttribute("aria-hidden", "true");
    });

    it("carries the override hook", () => {
      const { container } = render(<SummaryCard label="라벨" />);
      expect(
        container.querySelector('[data-cocso-component="summary-card"]')
      ).toBeInTheDocument();
    });
  });

  describe("value", () => {
    it("is plain text without href", () => {
      render(<SummaryCard.Value count={3} suffix="건" />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.getByText("3건")).toBeInTheDocument();
    });

    it("links through with href", () => {
      render(<SummaryCard.Value count={3} href="/pending" suffix="건" />);
      const link = screen.getByRole("link", { name: "3건" });
      expect(link).toHaveAttribute("href", "/pending");
      expect(link).toHaveAttribute(
        "data-cocso-component",
        "summary-card-value"
      );
    });

    it("renders through a router link", () => {
      function RouterLink(props: ComponentProps<"a">) {
        return <a data-router="" {...props} />;
      }
      render(
        <SummaryCard.Value
          count={3}
          href="/pending"
          render={(props) => <RouterLink {...props} />}
        />
      );
      expect(screen.getByRole("link")).toHaveAttribute("data-router");
      expect(screen.getByRole("link")).toHaveAttribute("href", "/pending");
    });
  });

  describe("accessibility", () => {
    it("passes axe", async () => {
      const { container } = render(
        <div>
          <SummaryCard icon={<svg />} label="총 CSO사 수">
            <SummaryCard.Value count={128} href="/dealers" suffix="개" />
          </SummaryCard>
          <SummaryCard label="월말 예상 금액">
            <SummaryCard.Value count="1,234,000" suffix="원" />
          </SummaryCard>
        </div>
      );
      const results = await axe.run(container, {
        rules: { "color-contrast": { enabled: false } },
      });
      expect(results.violations.map((violation) => violation.id)).toEqual([]);
    });
  });
});
