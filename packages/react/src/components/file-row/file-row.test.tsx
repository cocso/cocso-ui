import { render, screen } from "@testing-library/react";

import { FileRow } from "./file-row";

describe("FileRow", () => {
  describe("rendering", () => {
    it("renders the file name", () => {
      render(<FileRow name="사업자등록증.pdf" />);
      expect(screen.getByText("사업자등록증.pdf")).toBeInTheDocument();
    });

    it("carries the override hook", () => {
      const { container } = render(<FileRow name="a.pdf" />);
      expect(
        container.querySelector('[data-cocso-component="file-row"]')
      ).toBeInTheDocument();
    });

    it("renders the actions it is given", () => {
      render(
        <FileRow
          actions={
            <button aria-label="삭제" type="button">
              x
            </button>
          }
          name="a.pdf"
        />
      );
      expect(screen.getByRole("button", { name: "삭제" })).toBeInTheDocument();
    });
  });

  describe("size", () => {
    /**
     * The point of the component: the shape comes from the `input` recipe, not
     * from numbers copied off a field. If the recipe class stops being applied
     * the row still looks about right in isolation and silently stops matching
     * the input beside it, which is the bug it exists to prevent.
     */
    it("applies the input recipe class", () => {
      const { container } = render(<FileRow name="a.pdf" />);
      const row = container.querySelector(
        '[data-cocso-component="file-row"]'
      ) as HTMLElement;
      expect(row.className).toContain("cocso-input");
    });

    it("defaults to the small size", () => {
      const { container } = render(<FileRow name="a.pdf" />);
      expect(
        container.querySelector(".cocso-input--size-small")
      ).not.toBeNull();
    });

    it("takes the other input sizes", () => {
      const { container } = render(<FileRow name="a.pdf" size="medium" />);
      expect(
        container.querySelector(".cocso-input--size-medium")
      ).not.toBeNull();
    });
  });

  describe("href", () => {
    it("renders the name as a link when given one", () => {
      render(<FileRow href="/files/a.pdf" name="a.pdf" />);
      expect(screen.getByRole("link", { name: "a.pdf" })).toHaveAttribute(
        "href",
        "/files/a.pdf"
      );
    });

    it("renders plain text when given none", () => {
      render(<FileRow name="a.pdf" />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });

  describe("disabled", () => {
    it("marks the row", () => {
      const { container } = render(<FileRow disabled name="a.pdf" />);
      expect(
        container.querySelector('[data-cocso-component="file-row"]')
      ).toHaveAttribute("data-disabled", "true");
    });

    /**
     * A dimmed link that still navigates is the whole failure mode, so the one
     * interactive thing the row owns is actually withdrawn. Anything in
     * `actions` is the caller's to disable — documented on the prop.
     */
    it("stops the name being a link", () => {
      render(<FileRow disabled href="/files/a.pdf" name="a.pdf" />);
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
      expect(screen.getByText("a.pdf")).toBeInTheDocument();
    });
  });

  describe("error", () => {
    it("renders without throwing", () => {
      expect(() => render(<FileRow error name="a.pdf" />)).not.toThrow();
    });

    it("does not invent an ARIA state on a plain row", () => {
      // The row is not a form control; `aria-invalid` on a roleless div
      // announces nothing. The message and the invalid state belong to `Field`.
      const { container } = render(<FileRow error name="a.pdf" />);
      expect(
        container.querySelector('[data-cocso-component="file-row"]')
      ).not.toHaveAttribute("aria-invalid");
    });
  });
});
