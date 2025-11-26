'use client';

import React, { useRef, useState } from 'react';

export interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  accept?: string;
  error?: string;
  helperText?: string;
  onFileSelect?: (file: File | null) => void;
  preview?: boolean;
  defaultValue?: string; // For existing image URLs
}

const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ label, accept, error, helperText, onFileSelect, preview = true, defaultValue, className = '', id, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultValue || null);
    const fileInputId = id || `file-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = !!error;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setSelectedFile(file);

      if (file && preview && file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      onFileSelect?.(file);
    };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(defaultValue || null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    onFileSelect?.(null);
  };

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    return (
      <div className="w-full">
        <label
          htmlFor={fileInputId}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {props.required && <span className="text-error-500 ml-1">*</span>}
        </label>

        <div className={`
          border-2 border-dashed rounded-lg p-6 text-center
          transition-all duration-200
          ${hasError
            ? 'border-error-300 bg-error-50'
            : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'
          }
        `}>
          <input
            ref={inputRef}
            id={fileInputId}
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
            aria-invalid={hasError}
            aria-describedby={error ? `${fileInputId}-error` : helperText ? `${fileInputId}-helper` : undefined}
            {...props}
          />

          {preview && previewUrl ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 rounded-lg shadow-md"
                />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="absolute top-2 right-2 p-1 bg-error-600 text-white rounded-full hover:bg-error-700"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedFile && <p className="text-sm text-gray-600">{selectedFile.name}</p>}
            </div>
          ) : (
            <div>
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-4">
                <label
                  htmlFor={fileInputId}
                  className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Select a file
                </label>
                <p className="mt-2 text-xs text-gray-500">
                  {accept ? `Accepted formats: ${accept}` : 'PNG, JPG, GIF up to 10MB'}
                </p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <p id={`${fileInputId}-error`} className="mt-1.5 text-sm text-error-600" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${fileInputId}-helper`} className="mt-1.5 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload';

export default FileUpload;

