import { CloseIcon, PlusIcon } from '@cocso-ui/react-icons';
import type * as React from 'react';
import { type ComponentPropsWithoutRef, forwardRef, useCallback, useRef, useState } from 'react';
import { Body } from '../body';
import styles from './FileUpload.module.css';

export interface FileItem {
  file: File;
  name: string;
  size: number;
}

export interface FileUploadProps extends ComponentPropsWithoutRef<'input'> {
  maxFiles?: number;
  files: FileItem[];
  onFilesChange: (files: FileItem[]) => void;
  onRemove?: (fileName: string) => void;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
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

        const types = accept.split(',').map(type => type.trim());
        return types.some(type => {
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

        const validFiles = fileArray.filter(file => {
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

        const filesToAdd = validFiles.slice(0, remainingSlots).map(file => ({
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
        const updatedFiles = files.filter(file => file.name !== fileName);
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
      <div className={styles.wrapper}>
        {!hideDropzone && (
          // biome-ignore lint/a11y/noStaticElementInteractions: This is a custom file upload component
          <div
            ref={dropZoneRef}
            className={styles.uploader}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            data-drag-active={isDragActive}
          >
            <input
              ref={node => {
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

            <Body size="xs" color="palette.gray-600">
              파일을 여기에 끌어다 놓거나, 클릭하여 파일을 선택하세요
              <br />
              (최대 3MB)
            </Body>

            <PlusIcon size={20} />
          </div>
        )}

        {files.length > 0 && (
          <div className={styles.list}>
            {files.map(file => (
              <div key={file.name} className={styles.item}>
                <Body size="xs">{file.name}</Body>
                <button
                  type="button"
                  onClick={() => handleRemove(file.name)}
                  className={styles.remove}
                >
                  <CloseIcon size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
);
