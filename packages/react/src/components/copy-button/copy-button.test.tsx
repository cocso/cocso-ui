import { act, fireEvent, render, screen } from "@testing-library/react";

import { CopyButton } from "./copy-button";

const originalClipboard = Object.getOwnPropertyDescriptor(
  navigator,
  "clipboard"
);

function stubClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

/** Lets the awaited `writeText` settle and React flush the state it sets. */
async function settle() {
  await act(async () => {
    await Promise.resolve();
  });
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

describe("CopyButton", () => {
  it("has the default accessible name and tooltip", () => {
    render(<CopyButton text="abc" />);
    const button = screen.getByRole("button", { name: "복사" });
    expect(button).toHaveAttribute("title", "복사");
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-cocso-component", "copy-button");
  });

  it("takes custom labels", () => {
    render(<CopyButton label="Copy link" text="abc" />);
    expect(
      screen.getByRole("button", { name: "Copy link" })
    ).toBeInTheDocument();
  });

  it("writes the text and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    const onCopySuccess = vi.fn();
    render(<CopyButton onCopySuccess={onCopySuccess} text="abc" />);

    fireEvent.click(screen.getByRole("button"));
    await settle();

    expect(writeText).toHaveBeenCalledWith("abc");
    expect(onCopySuccess).toHaveBeenCalledWith("abc");
    expect(screen.getByRole("button", { name: "복사됨" })).toHaveAttribute(
      "data-copied",
      "true"
    );
  });

  it("reports a failure without logging", async () => {
    const error = new Error("denied");
    stubClipboard(vi.fn().mockRejectedValue(error));
    const consoleError = vi.spyOn(console, "error");
    const onCopyError = vi.fn();
    const onCopySuccess = vi.fn();
    render(
      <CopyButton
        onCopyError={onCopyError}
        onCopySuccess={onCopySuccess}
        text="abc"
      />
    );

    fireEvent.click(screen.getByRole("button"));
    await settle();

    expect(onCopyError).toHaveBeenCalledWith(error);
    expect(onCopySuccess).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "복사" })).toBeInTheDocument();
  });

  it("reports a missing clipboard API as an error", async () => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: undefined,
    });
    const onCopyError = vi.fn();
    render(<CopyButton onCopyError={onCopyError} text="abc" />);

    fireEvent.click(screen.getByRole("button"));
    await settle();

    expect(onCopyError).toHaveBeenCalledTimes(1);
  });

  it("returns to the copy icon after resetTimeoutSeconds", async () => {
    vi.useFakeTimers();
    stubClipboard(vi.fn().mockResolvedValue(undefined));
    render(<CopyButton resetTimeoutSeconds={1} text="abc" />);

    fireEvent.click(screen.getByRole("button"));
    await settle();
    expect(screen.getByRole("button", { name: "복사됨" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(999);
    });
    expect(screen.getByRole("button", { name: "복사됨" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.getByRole("button", { name: "복사" })).toBeInTheDocument();
  });

  it("clears the reset timer on unmount", async () => {
    vi.useFakeTimers();
    stubClipboard(vi.fn().mockResolvedValue(undefined));
    const { unmount } = render(<CopyButton text="abc" />);

    fireEvent.click(screen.getByRole("button"));
    await settle();
    expect(vi.getTimerCount()).toBeGreaterThan(0);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("runs the consumer's onClick and still copies", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    const onClick = vi.fn();
    render(<CopyButton onClick={onClick} text="abc" />);

    fireEvent.click(screen.getByRole("button"));
    await settle();

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith("abc");
  });

  it("skips the copy when onClick prevents default", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    stubClipboard(writeText);
    render(
      <CopyButton onClick={(event) => event.preventDefault()} text="abc" />
    );

    fireEvent.click(screen.getByRole("button"));
    await settle();

    expect(writeText).not.toHaveBeenCalled();
  });
});
