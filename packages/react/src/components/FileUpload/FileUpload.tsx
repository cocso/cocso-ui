import * as React from 'react';
import { useRef, useState, useCallback } from 'react';
import { Label } from '../Label';
import { Body } from '../Body';

export interface FileItem {
  file: File;
  name: string;
  size: number;
}

type FileUploadProps = {
  maxFiles?: number;
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  onRemove?: (fileName: string) => void;
} & React.ComponentPropsWithoutRef<'input'>;

const FileUploadContent = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ maxFiles = 2, files, onFilesChange, onRemove, multiple = true, accept, ...props }, ref) => {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    const FILE_SIZE_LIMIT = 3 * 1024 * 1024;

    const validateType = useCallback(
      (file: File): boolean => {
        if (!accept) {
          return true;
        }

        const types = accept.split(',').map((type) => type.trim());
        return types.some((type) => {
          if (type.endsWith('/*')) {
            const baseType = type.slice(0, -2);
            return file.type.startsWith(baseType);
          }
          return file.type === type || file.name.toLowerCase().endsWith(type);
        });
      },
      [accept],
    );

    const validateSize = useCallback((file: File): boolean => {
      if (file.size > FILE_SIZE_LIMIT) {
        alert(`${file.name}은(는) 3MB를 초과합니다.`);
        return false;
      }
      return true;
    }, []);

    const handleFiles = useCallback(
      (newFiles: FileList) => {
        const fileArray = Array.from(newFiles);

        const validFiles = fileArray.filter((file) => {
          if (!validateType(file)) {
            alert(`${file.name}은(는) 허용되지 않는 파일 타입입니다.`);
            return false;
          }
          return validateSize(file);
        });

        if (validFiles.length === 0) {
          return;
        }

        const remainingSlots = maxFiles - files.length;
        if (remainingSlots <= 0) {
          alert(`최대 ${maxFiles}개의 파일만 업로드할 수 있습니다.`);
          return;
        }

        const filesToAdd = validFiles.slice(0, remainingSlots).map((file) => ({
          file,
          name: file.name,
          size: file.size,
        }));

        onFilesChange([...files, ...filesToAdd]);
      },
      [files, maxFiles, onFilesChange, validateType, validateSize],
    );

    const handleDragEnter = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
        setIsDragActive(false);
      }
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const { files } = e.dataTransfer;
        if (files) {
          handleFiles(files);
        }
      },
      [handleFiles],
    );

    const handleFileInput = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files } = e.target;
        if (files) {
          handleFiles(files);
        }
      },
      [handleFiles],
    );

    const handleRemove = useCallback(
      (fileName: string) => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        onFilesChange(updatedFiles);
        onRemove?.(fileName);
      },
      [files, onFilesChange, onRemove],
    );

    const handleClick = useCallback(() => {
      inputRef.current?.click();
    }, []);

    const hideDropzone = files.length >= maxFiles || (!multiple && files.length >= 1);

    return (
      <div className="cocso-file-upload-wrapper">
        {!hideDropzone && (
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            className="cocso-file-upload"
            data-drag-active={isDragActive}
          >
            <input
              ref={(node) => {
                inputRef.current = node;
                if (typeof ref === 'function') {
                  ref(node);
                } else if (ref) {
                  ref.current = node;
                }
              }}
              type="file"
              onChange={handleFileInput}
              multiple={multiple}
              accept={accept}
              style={{ display: 'none' }}
              {...props}
            />

            <Label size="xs" color="palette.gray-600">
              파일을 여기에 끌어다 놓거나, 클릭하여 파일을 선택하세요 (최대 3MB)
            </Label>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </div>
        )}

        {files.length > 0 && (
          <div className="cocso-file-upload-list">
            {files.map((file) => (
              <div key={file.name} className="cocso-file-upload-item">
                <Body size="xs">{file.name}</Body>
                <button
                  type="button"
                  onClick={() => handleRemove(file.name)}
                  className="cocso-file-upload-remove"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);

export const FileUpload = Object.assign(FileUploadContent, {
  displayName: 'FileUpload',
});
