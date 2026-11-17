"use client";

import { CloseIcon, PlusIcon } from "@cocso-ui/react-icons";
import type { ComponentProps, DragEvent, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { cn } from "../../cn";
import { Button } from "../button";
import { FileRow } from "../file-row";
import { toast } from "../toast";
import { Typography } from "../typography";
import styles from "./file-uploader.module.css";

/** One chosen file. The `File` is kept so the caller can upload it later. */
export interface FileItem {
  file: File;
  name: string;
  size: number;
}

/** Why a file was turned away. */
export type FileUploaderRejectionReason = "type" | "size" | "count";

export interface FileUploaderRejection {
  /** The file that was turned away. */
  file: File;
  /** The message that describes it, already resolved from `messages`. */
  message: string;
  reason: FileUploaderRejectionReason;
}

/** Every word the component says. Each one is optional; the rest keep the default. */
export interface FileUploaderMessages {
  /** The prompt in the one-line (`compact`) drop zone. */
  compactPrompt?: ReactNode;
  /** The `(max N MB)` hint shown when no `sizeHint` is given. */
  maxSizeHint?: (maxSizeMb: number) => ReactNode;
  /** The prompt in the default drop zone. */
  prompt?: ReactNode;
  /** A file arrived after `maxFiles` was reached. */
  rejectCount?: (maxFiles: number) => string;
  /** A file is larger than `maxSize`. */
  rejectSize?: (file: File, maxSizeMb: number) => string;
  /** A file does not match `accept`. */
  rejectType?: (file: File) => string;
  /** Accessible name of the remove button on each row. */
  remove?: (fileName: string) => string;
}

const DEFAULT_MESSAGES: Required<FileUploaderMessages> = {
  compactPrompt: "끌어다 놓거나 클릭해 등록",
  prompt: "파일을 여기에 끌어다 놓거나, 클릭하여 파일을 선택해주세요",
  maxSizeHint: (maxSizeMb) => `(최대 ${maxSizeMb}MB)`,
  remove: (fileName) => `${fileName} 삭제`,
  rejectCount: (maxFiles) =>
    `최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`,
  rejectSize: (file, maxSizeMb) =>
    `${file.name}은(는) ${maxSizeMb}MB를 초과합니다.`,
  rejectType: (file) => `${file.name}은(는) 허용되지 않는 파일 타입입니다.`,
};

const BYTES_PER_MB = 1024 * 1024;
const DEFAULT_MAX_SIZE = 3 * BYTES_PER_MB;

export interface FileUploaderProps
  extends Omit<ComponentProps<"input">, "type" | "size" | "ref"> {
  /**
   * One-line drop zone. A table row that holds an uploader grows by the full
   * zone's height otherwise; this lays the prompt out on a single line.
   */
  compact?: boolean;
  /** The chosen files (controlled). */
  files: FileItem[];
  /** Most files that may be chosen in total. Default 2. */
  maxFiles?: number;
  /** Largest single file in bytes. Default 3 MB. */
  maxSize?: number;
  /** Override any of the default (Korean) words. */
  messages?: FileUploaderMessages;
  /** Called with the next list whenever files are added or removed. */
  onFilesChange: (files: FileItem[]) => void;
  /**
   * Called with every file turned away by one pick or drop. When given, the
   * default error toasts are not shown — the caller reports them instead.
   */
  onReject?: (rejections: FileUploaderRejection[]) => void;
  /** Called after a row's remove button takes a file out. */
  onRemove?: (fileName: string) => void;
  /** Forwarded to the underlying `<input type="file">`. */
  ref?: Ref<HTMLInputElement>;
  /** Replaces the `(max N MB)` hint. Still shown while disabled. */
  sizeHint?: ReactNode;
}

function matchesAccept(file: File, accept: string | undefined): boolean {
  if (!accept) {
    return true;
  }
  return accept
    .split(",")
    .map((type) => type.trim())
    .filter(Boolean)
    .some((type) => {
      if (type.endsWith("/*")) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return (
        file.type === type ||
        file.name.toLowerCase().endsWith(type.toLowerCase())
      );
    });
}

/**
 * Drag-and-drop or pick files, listed underneath as `FileRow`s.
 *
 * The drop zone is a `<label>` around a real, visually hidden
 * `<input type="file">`, so Tab reaches the input, Enter and Space open the
 * picker natively, and the zone's prompt is the input's accessible name. The
 * zone is drawn focused while the input is. It disappears once `maxFiles` is
 * reached (or one file is chosen when `multiple` is false).
 *
 * Files that fail `accept`, `maxSize` or `maxFiles` are turned away and
 * reported — through `onReject` when given, otherwise as error toasts (which
 * need a `Toaster` mounted).
 */
export function FileUploader({
  ref,
  className,
  style,
  files,
  onFilesChange,
  onRemove,
  onReject,
  maxFiles = 2,
  maxSize = DEFAULT_MAX_SIZE,
  sizeHint,
  compact = false,
  messages: messagesProp,
  multiple = true,
  accept,
  disabled = false,
  onChange,
  ...props
}: FileUploaderProps) {
  const messages = { ...DEFAULT_MESSAGES, ...messagesProp };
  const [isDragActive, setIsDragActive] = useState(false);
  const zoneRef = useRef<HTMLLabelElement>(null);
  const maxSizeMb = Math.round(maxSize / BYTES_PER_MB);

  // Names and sizes can repeat, so each `File` gets an id the first time it
  // is seen. The caller keeps the same `File` across renders, so the id holds.
  const keys = useRef(new WeakMap<File, number>());
  const nextKey = useRef(0);
  const keyFor = (file: File) => {
    let key = keys.current.get(file);
    if (key === undefined) {
      key = nextKey.current++;
      keys.current.set(file, key);
    }
    return key;
  };

  const addFiles = (incoming: FileList) => {
    const rejections: FileUploaderRejection[] = [];
    const accepted: File[] = [];

    for (const file of Array.from(incoming)) {
      if (!matchesAccept(file, accept)) {
        rejections.push({
          file,
          reason: "type",
          message: messages.rejectType(file),
        });
      } else if (file.size > maxSize) {
        rejections.push({
          file,
          reason: "size",
          message: messages.rejectSize(file, maxSizeMb),
        });
      } else {
        accepted.push(file);
      }
    }

    const remaining = Math.max(0, maxFiles - files.length);
    const added = accepted.slice(0, remaining);
    for (const file of accepted.slice(remaining)) {
      rejections.push({
        file,
        reason: "count",
        message: messages.rejectCount(maxFiles),
      });
    }

    if (rejections.length > 0) {
      if (onReject) {
        onReject(rejections);
      } else {
        // One toast per distinct message: ten files over the count limit
        // say so once, not ten times.
        for (const message of new Set(rejections.map((r) => r.message))) {
          toast.error(message);
        }
      }
    }

    if (added.length > 0) {
      onFilesChange([
        ...files,
        ...added.map((file) => ({ file, name: file.name, size: file.size })),
      ]);
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragActive(true);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const next = event.relatedTarget as Node | null;
    if (!(next && zoneRef.current?.contains(next))) {
      setIsDragActive(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragActive(false);
    if (disabled) {
      return;
    }
    if (event.dataTransfer?.files) {
      addFiles(event.dataTransfer.files);
    }
  };

  const handleRemove = (index: number) => {
    const removed = files[index];
    onFilesChange(files.filter((_, i) => i !== index));
    if (removed) {
      onRemove?.(removed.name);
    }
  };

  const hideZone = files.length >= maxFiles || (!multiple && files.length >= 1);
  const hint = sizeHint ?? messages.maxSizeHint(maxSizeMb);
  const prompt = compact ? messages.compactPrompt : messages.prompt;

  return (
    <div
      className={cn(styles.uploader, className)}
      data-cocso-component="file-uploader"
      style={style}
    >
      {!hideZone && (
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: drag and drop has no keyboard equivalent; the wrapped input is the keyboard path
        <label
          className={cn(styles.zone, compact && styles.compact)}
          data-cocso-component="file-uploader-dropzone"
          data-compact={compact || undefined}
          data-disabled={disabled || undefined}
          data-drag-active={isDragActive || undefined}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          ref={zoneRef}
        >
          <input
            accept={accept}
            className={styles.input}
            disabled={disabled}
            multiple={multiple}
            ref={ref}
            type="file"
            {...props}
            onChange={(event) => {
              onChange?.(event);
              if (event.target.files) {
                addFiles(event.target.files);
              }
              event.target.value = "";
            }}
          />
          {compact && !disabled && (
            <PlusIcon aria-hidden className={styles.icon} size={20} />
          )}
          <Typography
            className={styles.text}
            render={<span />}
            size="x-small"
            type="body"
          >
            {/* While disabled only the hint stays — it usually says why. */}
            {!disabled && <span className={styles.prompt}>{prompt}</span>}
            {!disabled && (compact ? " · " : " ")}
            <span className={styles.hint}>{hint}</span>
          </Typography>
          {!(compact || disabled) && (
            <PlusIcon aria-hidden className={styles.icon} size={20} />
          )}
        </label>
      )}

      {files.length > 0 && (
        <ul className={styles.list} data-cocso-component="file-uploader-list">
          {files.map((item, index) => (
            <li className={styles.item} key={keyFor(item.file)}>
              <FileRow
                actions={
                  <Button
                    aria-label={messages.remove(item.name)}
                    disabled={disabled}
                    onClick={() => handleRemove(index)}
                    size="x-small"
                    svgOnly
                    type="button"
                    variant="ghost"
                  >
                    <CloseIcon size={14} />
                  </Button>
                }
                disabled={disabled}
                name={item.name}
                stretch
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
