import { render } from "@testing-library/react";

import { Toaster, toast } from ".";

describe("toast", () => {
  describe("Toaster", () => {
    it("renders the Toaster component without errors", () => {
      render(<Toaster />);
      expect(document.body).toBeInTheDocument();
    });

    it("renders Toaster as a region landmark", () => {
      render(<Toaster />);
      expect(document.body.innerHTML).not.toBe("");
    });

    it("accepts position prop without throwing", () => {
      expect(() => render(<Toaster position="top-right" />)).not.toThrow();
    });

    it("accepts theme prop without throwing", () => {
      expect(() => render(<Toaster theme="dark" />)).not.toThrow();
    });
  });

  describe("toast function", () => {
    it("is a function", () => {
      expectTypeOf(toast).toBeFunction();
    });

    it("has a success method", () => {
      expectTypeOf(toast.success).toBeFunction();
    });

    it("has an error method", () => {
      expectTypeOf(toast.error).toBeFunction();
    });

    it("has a warning method", () => {
      expectTypeOf(toast.warning).toBeFunction();
    });

    it("has an info method", () => {
      expectTypeOf(toast.info).toBeFunction();
    });

    it("has a dismiss method", () => {
      expectTypeOf(toast.dismiss).toBeFunction();
    });

    it("calling toast returns a toast id", () => {
      render(<Toaster />);
      const id = toast("Hello world");
      expect(id).toBeDefined();
    });
  });
});
