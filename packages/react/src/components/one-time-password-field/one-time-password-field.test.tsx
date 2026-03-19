import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OneTimePasswordField } from "./one-time-password-field";

describe("OneTimePasswordField", () => {
  it("renders a hidden input", () => {
    const { container } = render(<OneTimePasswordField maxLength={4} />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
  });

  it("renders maxLength slot elements", () => {
    const { container } = render(<OneTimePasswordField maxLength={6} />);
    expect(
      container.querySelectorAll("div[class]").length
    ).toBeGreaterThanOrEqual(6);
  });

  it("reflects the value in the hidden input", () => {
    const { container } = render(
      <OneTimePasswordField
        maxLength={4}
        onValueChange={vi.fn()}
        value="1234"
      />
    );
    const input = container.querySelector("input");
    expect(input).toHaveValue("1234");
  });

  it("applies containerClassName", () => {
    const { container } = render(
      <OneTimePasswordField className="custom-container" maxLength={4} />
    );
    expect(container.querySelector(".custom-container")).toBeInTheDocument();
  });

  it("calls onValueChange when a character is typed", async () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <OneTimePasswordField maxLength={4} onValueChange={onValueChange} />
    );
    const input = container.querySelector("input") as HTMLInputElement;
    await userEvent.type(input, "1");
    expect(onValueChange).toHaveBeenCalledWith("1");
  });
});
