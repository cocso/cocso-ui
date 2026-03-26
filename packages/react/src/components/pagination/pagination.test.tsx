import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "./pagination";

describe("Pagination", () => {
  describe("rendering", () => {
    it("renders page buttons up to totalPages", () => {
      render(<Pagination onChange={vi.fn()} page={1} totalPages={5} />);
      expect(
        screen.getByRole("button", { name: "Page 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Page 5" })
      ).toBeInTheDocument();
    });

    it("does not render arrow buttons when totalPages=1", () => {
      render(<Pagination onChange={vi.fn()} page={1} totalPages={1} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(1);
    });
  });

  describe("prev / next arrows", () => {
    it("disables the prev button on the first page", () => {
      render(<Pagination onChange={vi.fn()} page={1} totalPages={5} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.at(0)).toBeDisabled();
    });

    it("disables the next button on the last page", () => {
      render(<Pagination onChange={vi.fn()} page={5} totalPages={5} />);
      const buttons = screen.getAllByRole("button");
      expect(buttons.at(-1)).toBeDisabled();
    });

    it("calls onChange with page-1 when prev is clicked", async () => {
      const onChange = vi.fn();
      render(<Pagination onChange={onChange} page={3} totalPages={5} />);
      const buttons = screen.getAllByRole("button");
      await userEvent.click(buttons.at(0) as Element);
      expect(onChange).toHaveBeenCalledWith(2);
    });

    it("calls onChange with page+1 when next is clicked", async () => {
      const onChange = vi.fn();
      render(<Pagination onChange={onChange} page={3} totalPages={5} />);
      const buttons = screen.getAllByRole("button");
      await userEvent.click(buttons.at(-1) as Element);
      expect(onChange).toHaveBeenCalledWith(4);
    });
  });

  describe("page button click", () => {
    it("calls onChange with the clicked page number", async () => {
      const onChange = vi.fn();
      render(<Pagination onChange={onChange} page={1} totalPages={5} />);
      await userEvent.click(screen.getByRole("button", { name: "Page 3" }));
      expect(onChange).toHaveBeenCalledWith(3);
    });
  });

  describe("truncation", () => {
    it("always renders first and last page buttons when totalPages > maxVisible + 2", () => {
      render(<Pagination onChange={vi.fn()} page={5} totalPages={10} />);
      expect(
        screen.getByRole("button", { name: "Page 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Page 10" })
      ).toBeInTheDocument();
    });

    it("renders all page buttons when totalPages <= maxVisible + 2", () => {
      render(<Pagination onChange={vi.fn()} page={1} totalPages={7} />);
      for (let i = 1; i <= 7; i++) {
        expect(
          screen.getByRole("button", { name: `Page ${i}` })
        ).toBeInTheDocument();
      }
    });

    it("respects the maxVisible prop", () => {
      render(
        <Pagination maxVisible={3} onChange={vi.fn()} page={1} totalPages={4} />
      );
      expect(
        screen.getByRole("button", { name: "Page 4" })
      ).toBeInTheDocument();
    });

    it("does not render page buttons outside valid range during truncation", () => {
      render(
        <Pagination
          maxVisible={3}
          onChange={vi.fn()}
          page={2}
          totalPages={20}
        />
      );
      expect(
        screen.queryByRole("button", { name: "Page 0" })
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Page 1" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Page 20" })
      ).toBeInTheDocument();
    });
  });

  describe("active page indicator", () => {
    it("sets data-active=true on the current page button", () => {
      render(<Pagination onChange={vi.fn()} page={3} totalPages={5} />);
      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
        "data-active",
        "true"
      );
    });

    it("sets data-active=false on non-current page buttons", () => {
      render(<Pagination onChange={vi.fn()} page={3} totalPages={5} />);
      expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
        "data-active",
        "false"
      );
    });

    it("sets aria-current=page on the active page button", () => {
      render(<Pagination onChange={vi.fn()} page={3} totalPages={5} />);
      expect(screen.getByRole("button", { name: "Page 3" })).toHaveAttribute(
        "aria-current",
        "page"
      );
    });

    it("does not set aria-current on non-active page buttons", () => {
      render(<Pagination onChange={vi.fn()} page={3} totalPages={5} />);
      expect(
        screen.getByRole("button", { name: "Page 1" })
      ).not.toHaveAttribute("aria-current");
    });
  });
});
