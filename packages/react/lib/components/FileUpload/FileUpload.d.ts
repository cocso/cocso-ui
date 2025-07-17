import * as React from 'react';
export interface FileItem {
    file: File;
    name: string;
    size: number;
}
export declare const FileUpload: React.ForwardRefExoticComponent<{
    maxFiles?: number;
    files: FileItem[];
    onFilesChange: (files: FileItem[]) => void;
    onRemove?: (fileName: string) => void;
} & Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & React.RefAttributes<HTMLInputElement>> & {
    displayName: string;
};
