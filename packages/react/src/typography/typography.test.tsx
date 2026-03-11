import { render, screen } from "@testing-library/react";

import { lineHeight as lineHeightToken } from "../token";
import { Typography } from "./typography";

describe("Typography", () => {
  describe("default rendering", () => {
    it("renders children as a paragraph by default", () => {
      render(<Typography>Hello</Typography>);
      expect(screen.getByText("Hello").tagName).toBe("P");
    });

    it('renders children as a paragraph when type="body"', () => {
      render(<Typography type="body">Body text</Typography>);
      expect(screen.getByText("Body text").tagName).toBe("P");
    });

    it('renders children as h1 when type="display"', () => {
      render(<Typography type="display">Display text</Typography>);
      expect(
        screen.getByRole("heading", { level: 1, name: "Display text" })
      ).toBeInTheDocument();
    });

    it('renders children as h2 when type="heading"', () => {
      render(<Typography type="heading">Heading text</Typography>);
      expect(
        screen.getByRole("heading", { level: 2, name: "Heading text" })
      ).toBeInTheDocument();
    });

    it('renders children as a paragraph when type="custom"', () => {
      render(<Typography type="custom">Custom text</Typography>);
      expect(screen.getByText("Custom text").tagName).toBe("P");
    });
  });

  describe("render prop", () => {
    it("renders as the provided element when render is given", () => {
      render(<Typography render={<span>Span text</span>} />);
      expect(screen.getByText("Span text").tagName).toBe("SPAN");
    });

    it("renders as anchor when render is given an anchor", () => {
      render(<Typography render={<a href="/test">Link text</a>} />);
      expect(
        screen.getByRole("link", { name: "Link text" })
      ).toBeInTheDocument();
    });
  });

  describe("color CSS variable", () => {
    it("sets --cocso-typography-font-color when color is provided", () => {
      const { container } = render(
        <Typography color="red">Colored</Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-color")).toBe(
        "red"
      );
    });

    it("does not set --cocso-typography-font-color when color is omitted", () => {
      const { container } = render(<Typography>No color</Typography>);
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-color")).toBe(
        ""
      );
    });
  });

  describe("font-weight CSS variable", () => {
    it.each([
      ["normal", "400"],
      ["medium", "500"],
      ["bold", "700"],
    ] as const)('sets font weight to %s when weight="%s"', (weight, expectedValue) => {
      const { container } = render(
        <Typography weight={weight}>Text</Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-weight")).toBe(
        expectedValue
      );
    });

    it('defaults to bold weight for type="heading"', () => {
      const { container } = render(
        <Typography type="heading">Heading</Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-weight")).toBe(
        "700"
      );
    });

    it('defaults to normal weight for type="body"', () => {
      const { container } = render(<Typography type="body">Body</Typography>);
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-weight")).toBe(
        "400"
      );
    });
  });

  describe("font-size CSS variable", () => {
    it.each([
      ["large", "18px"],
      ["medium", "16px"],
      ["small", "14px"],
      ["x-small", "12px"],
    ] as const)('sets font size for body size="%s"', (size, expectedPx) => {
      const { container } = render(
        <Typography size={size} type="body">
          Text
        </Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        expectedPx
      );
    });

    it('sets default font size to 16px for type="custom" without size', () => {
      const { container } = render(<Typography>Text</Typography>);
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        "16px"
      );
    });

    it('sets responsive font-size CSS variables for type="display"', () => {
      const { container } = render(
        <Typography size="large" type="display">
          Display
        </Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        "44px"
      );
      expect(
        el.style.getPropertyValue("--cocso-tablet-typography-font-size")
      ).toBe("60px");
    });
  });

  describe("additional props", () => {
    it("forwards className to the rendered element", () => {
      render(<Typography className="custom-class">Text</Typography>);
      expect(screen.getByText("Text")).toHaveClass("custom-class");
    });

    it("forwards data attributes to the rendered element", () => {
      render(<Typography data-testid="typo">Text</Typography>);
      expect(screen.getByTestId("typo")).toBeInTheDocument();
    });
  });
});

describe("Typography heading font sizes", () => {
  it.each([
    ["x-large", "28px", "36px"],
    ["large", "24px", "32px"],
    ["medium", "20px", "24px"],
  ] as const)(
    'sets responsive font-size for heading size="%s"',
    (size, expectedBase, expectedTablet) => {
      const { container } = render(
        <Typography size={size} type="heading">
          Heading
        </Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        expectedBase
      );
      expect(
        el.style.getPropertyValue("--cocso-tablet-typography-font-size")
      ).toBe(expectedTablet);
    }
  );

  it.each([
    ["small", "18px"],
    ["x-small", "16px"],
  ] as const)(
    'sets flat font-size for heading size="%s"',
    (size, expectedBase) => {
      const { container } = render(
        <Typography size={size} type="heading">
          Heading
        </Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        expectedBase
      );
      expect(
        el.style.getPropertyValue("--cocso-tablet-typography-font-size")
      ).toBe("");
    }
  );
});

describe("Typography display font sizes", () => {
  it.each([
    ["medium", "32px", "44px"],
    ["small", "28px", "36px"],
  ] as const)(
    'sets responsive font-size for display size="%s"',
    (size, expectedBase, expectedTablet) => {
      const { container } = render(
        <Typography size={size} type="display">
          Display
        </Typography>
      );
      const el = container.firstChild as HTMLElement;
      expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
        expectedBase
      );
      expect(
        el.style.getPropertyValue("--cocso-tablet-typography-font-size")
      ).toBe(expectedTablet);
    }
  );
});

describe("Typography custom responsive font size", () => {
  it("supports array-based responsive size [base, tablet]", () => {
    const { container } = render(
      <Typography size={[28, 36]} type="custom">
        Text
      </Typography>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
      "28px"
    );
    expect(
      el.style.getPropertyValue("--cocso-tablet-typography-font-size")
    ).toBe("36px");
    expect(
      el.style.getPropertyValue("--cocso-desktop-typography-font-size")
    ).toBe("");
  });

  it("supports array-based responsive size [base, tablet, desktop]", () => {
    const { container } = render(
      <Typography size={[28, 36, 44]} type="custom">
        Text
      </Typography>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
      "28px"
    );
    expect(
      el.style.getPropertyValue("--cocso-tablet-typography-font-size")
    ).toBe("36px");
    expect(
      el.style.getPropertyValue("--cocso-desktop-typography-font-size")
    ).toBe("44px");
  });

  it("supports object-based responsive size { base, tablet, desktop }", () => {
    const { container } = render(
      <Typography size={{ base: 28, tablet: 36, desktop: 44 }} type="custom">
        Text
      </Typography>
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.getPropertyValue("--cocso-typography-font-size")).toBe(
      "28px"
    );
    expect(
      el.style.getPropertyValue("--cocso-tablet-typography-font-size")
    ).toBe("36px");
    expect(
      el.style.getPropertyValue("--cocso-desktop-typography-font-size")
    ).toBe("44px");
  });
});

describe("Typography line-height CSS variable", () => {
  it.each([
    ["none", "1"],
    ["tight", "1.25"],
    ["snug", "1.375"],
    ["normal", "1.5"],
    ["relaxed", "1.625"],
    ["loose", "2"],
  ] as const)('sets --cocso-typography-line-height for lineHeight="%s"', (lh, expected) => {
    const { container } = render(
      <Typography lineHeight={lh}>Text</Typography>
    );
    const el = container.firstChild as HTMLElement;
    expect(
      el.style.getPropertyValue("--cocso-typography-line-height")
    ).toBe(expected);
  });
});
