"use client";

import React, { useRef, useState } from "react";
import { Upload, File, X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui";

interface FileUploadProps {
  onUpload: (fileName: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  label?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  allowedTypes = [".pdf", ".jpg", ".jpeg", ".png"],
  maxSizeMB = 5,
  label = "Upload Pension Worksheet",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const validateFile = (file: File): boolean => {
    setError(null);

    // Validate type
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.join(", ")}`);
      return false;
    }

    // Validate size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      setError(`File is too large. Maximum size is ${maxSizeMB}MB.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setError(null);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;

    // Simulate progress upload for premium dynamic feel
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onUpload(selectedFile.name);
            handleClearFile();
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={allowedTypes.join(",")}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#094029] rounded-2xl p-8 bg-slate-50 hover:bg-[#ECFAF2]/30 cursor-pointer transition-all duration-300 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-[#ECFAF2] flex items-center justify-center text-[#094029] mb-4">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 font-sans">{label}</p>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            Drag & drop your file here, or click to browse
          </p>
          <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider font-sans font-bold">
            Supports: {allowedTypes.join(", ")} (Max: {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                <File className="w-5 h-5" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate max-w-[200px] sm:max-w-xs font-sans">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-400 font-sans">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            {uploadProgress === null && (
              <button
                onClick={handleClearFile}
                className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload progress indicator */}
          {uploadProgress !== null && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#094029] transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2 font-sans">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}

          {uploadProgress === null && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUploadSubmit} size="sm">
                Submit File
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl font-sans">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
