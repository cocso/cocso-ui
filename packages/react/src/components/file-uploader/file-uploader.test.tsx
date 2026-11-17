import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ComponentProps, useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { type FileItem, FileUploader } from "./file-uploader";

const PROMPT = /파일을 여기에 끌어다 놓거나/;
const SIZE_HINT = /\(최대 3MB\)/;
const COMPACT_PROMPT = /끌어다 놓거나 클릭해 등록/;

const makeFile = (name: string, size = 10, type = "application/pdf") =>
  new File([new Uint8Array(size)], name, { type });

const item = (name: string): FileItem => {
  const file = makeFile(name);
  return { file, name, size: file.size };
};

function Harness(
  props: Partial<ComponentProps<typeof FileUploader>> & {
    initial?: FileItem[];
  }
) {
  const { initial = [], ...rest } = props;
  const [files, setFiles] = useState<FileItem[]>(initial);
  return <FileUploader {...rest} files={files} onFilesChange={setFiles} />;
}

const fileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe("FileUploader", () => {
  describe("rendering", () => {
    it("carries the override hooks", () => {
      const { container } = render(
        <FileUploader files={[item("a.pdf")]} onFilesChange={vi.fn()} />
      );
      for (const name of [
        "file-uploader",
        "file-uploader-dropzone",
        "file-uploader-list",
      ]) {
        expect(
          container.querySelector(`[data-cocso-component="${name}"]`)
        ).toBeInTheDocument();
      }
    });

    it("names the file input with the prompt and the size hint", () => {
      render(<FileUploader files={[]} onFilesChange={vi.fn()} />);
      const input = screen.getByLabelText(PROMPT);
      expect(input).toHaveAttribute("type", "file");
      expect(input).toHaveAccessibleName(SIZE_HINT);
    });

    it("uses the compact prompt", () => {
      render(<FileUploader compact files={[]} onFilesChange={vi.fn()} />);
      expect(screen.getByLabelText(COMPACT_PROMPT)).toBeInTheDocument();
    });

    it("takes overridden messages", () => {
      render(
        <FileUploader
          files={[item("a.pdf")]}
          messages={{
            maxSizeHint: (mb) => `(up to ${mb} MB)`,
            prompt: "Drop files",
            remove: (name) => `Remove ${name}`,
          }}
          onFilesChange={vi.fn()}
        />
      );
      expect(
        screen.getByLabelText("Drop files (up to 3 MB)")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Remove a.pdf" })
      ).toBeInTheDocument();
    });

    it("replaces the size hint with sizeHint", () => {
      render(
        <FileUploader files={[]} onFilesChange={vi.fn()} sizeHint="최대 10MB" />
      );
      expect(screen.getByText("최대 10MB")).toBeInTheDocument();
      expect(screen.queryByText("(최대 3MB)")).not.toBeInTheDocument();
    });

    it("lists chosen files as FileRows", () => {
      const { container } = render(
        <FileUploader
          files={[item("a.pdf"), item("b.pdf")]}
          maxFiles={3}
          onFilesChange={vi.fn()}
        />
      );
      expect(
        container.querySelectorAll('[data-cocso-component="file-row"]')
      ).toHaveLength(2);
    });

    it("hides the zone once maxFiles is reached", () => {
      render(
        <FileUploader
          files={[item("a.pdf")]}
          maxFiles={1}
          onFilesChange={vi.fn()}
        />
      );
      expect(screen.queryByLabelText(PROMPT)).not.toBeInTheDocument();
    });

    it("hides the zone after one file when not multiple", () => {
      render(
        <FileUploader
          files={[item("a.pdf")]}
          maxFiles={5}
          multiple={false}
          onFilesChange={vi.fn()}
        />
      );
      expect(screen.queryByLabelText(PROMPT)).not.toBeInTheDocument();
    });

    it("forwards ref and input props to the input", () => {
      const ref = { current: null as HTMLInputElement | null };
      render(
        <FileUploader
          accept=".xlsx"
          files={[]}
          name="upload"
          onFilesChange={vi.fn()}
          ref={ref}
        />
      );
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
      expect(ref.current).toHaveAttribute("accept", ".xlsx");
      expect(ref.current).toHaveAttribute("name", "upload");
    });
  });

  describe("keyboard", () => {
    it("reaches the input with Tab and opens the picker with Enter and Space", async () => {
      const { container } = render(<Harness />);
      const input = fileInput(container);
      const click = vi.fn();
      input.addEventListener("click", click);
      await userEvent.tab();
      expect(input).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await userEvent.keyboard(" ");
      expect(click).toHaveBeenCalledTimes(2);
    });

    it("is skipped by Tab while disabled", async () => {
      render(
        <>
          <FileUploader disabled files={[]} onFilesChange={vi.fn()} />
          <button type="button">next</button>
        </>
      );
      await userEvent.tab();
      expect(screen.getByRole("button", { name: "next" })).toHaveFocus();
    });
  });

  describe("choosing files", () => {
    it("adds picked files", async () => {
      const { container } = render(<Harness maxFiles={3} />);
      await userEvent.upload(fileInput(container), [
        makeFile("a.pdf"),
        makeFile("b.pdf"),
      ]);
      expect(screen.getByText("a.pdf")).toBeInTheDocument();
      expect(screen.getByText("b.pdf")).toBeInTheDocument();
    });

    it("adds dropped files", () => {
      const { container } = render(<Harness />);
      const zone = container.querySelector(
        '[data-cocso-component="file-uploader-dropzone"]'
      ) as HTMLElement;
      fireEvent.dragEnter(zone);
      expect(zone).toHaveAttribute("data-drag-active", "true");
      fireEvent.drop(zone, {
        dataTransfer: { files: [makeFile("dropped.pdf")] },
      });
      expect(zone).not.toHaveAttribute("data-drag-active");
      expect(screen.getByText("dropped.pdf")).toBeInTheDocument();
    });

    it("ignores drops while disabled", () => {
      const onFilesChange = vi.fn();
      const { container } = render(
        <FileUploader disabled files={[]} onFilesChange={onFilesChange} />
      );
      const zone = container.querySelector(
        '[data-cocso-component="file-uploader-dropzone"]'
      ) as HTMLElement;
      fireEvent.drop(zone, { dataTransfer: { files: [makeFile("a.pdf")] } });
      expect(onFilesChange).not.toHaveBeenCalled();
    });

    it("rejects files over maxSize, of the wrong type, and past maxFiles", () => {
      const onReject = vi.fn();
      const onFilesChange = vi.fn();
      const { container } = render(
        <FileUploader
          accept=".pdf,image/*"
          files={[]}
          maxFiles={2}
          maxSize={100}
          onFilesChange={onFilesChange}
          onReject={onReject}
        />
      );
      const zone = container.querySelector(
        '[data-cocso-component="file-uploader-dropzone"]'
      ) as HTMLElement;
      fireEvent.drop(zone, {
        dataTransfer: {
          files: [
            makeFile("big.pdf", 200),
            makeFile("sheet.xlsx", 10, "application/vnd.ms-excel"),
            makeFile("a.pdf"),
            makeFile("photo.png", 10, "image/png"),
            makeFile("c.pdf"),
          ],
        },
      });
      expect(onFilesChange).toHaveBeenCalledTimes(1);
      expect(
        onFilesChange.mock.calls[0][0].map((f: FileItem) => f.name)
      ).toEqual(["a.pdf", "photo.png"]);
      const rejections = onReject.mock.calls[0][0] as {
        file: File;
        reason: string;
        message: string;
      }[];
      expect(rejections.map((r) => [r.file.name, r.reason])).toEqual([
        ["big.pdf", "size"],
        ["sheet.xlsx", "type"],
        ["c.pdf", "count"],
      ]);
      expect(rejections[0].message).toBe("big.pdf은(는) 0MB를 초과합니다.");
    });
  });

  describe("removing files", () => {
    it("removes the row and reports the name", async () => {
      const onRemove = vi.fn();
      render(
        <Harness
          initial={[item("a.pdf"), item("b.pdf")]}
          maxFiles={3}
          onRemove={onRemove}
        />
      );
      await userEvent.click(screen.getByRole("button", { name: "a.pdf 삭제" }));
      expect(screen.queryByText("a.pdf")).not.toBeInTheDocument();
      expect(screen.getByText("b.pdf")).toBeInTheDocument();
      expect(onRemove).toHaveBeenCalledWith("a.pdf");
    });

    it("removes only one of two files with the same name", async () => {
      render(<Harness initial={[item("a.pdf"), item("a.pdf")]} maxFiles={3} />);
      await userEvent.click(
        screen.getAllByRole("button", { name: "a.pdf 삭제" })[0]
      );
      expect(screen.getAllByText("a.pdf")).toHaveLength(1);
    });

    it("disables remove while disabled", () => {
      render(
        <FileUploader
          disabled
          files={[item("a.pdf")]}
          onFilesChange={vi.fn()}
        />
      );
      expect(screen.getByRole("button", { name: "a.pdf 삭제" })).toBeDisabled();
    });
  });
});
