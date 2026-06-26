"use client";

import React, { useRef, useState } from "react";
import { Upload, File, X, AlertTriangle } from "lucide-react";
import { Button, Alert } from "@/components/ui";

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
    <div className="w-full font-[family-name:var(--font-body)]">
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
          className="flex flex-col items-center justify-center border-2 border-dashed border-[#C8C2BA] hover:border-[#094029] rounded-[20px] p-8 bg-white/40 hover:bg-[#ECFAF2]/30 cursor-pointer transition-all duration-[280ms] text-center shadow-[0_2px_8px_rgba(9,64,41,0.03)]"
        >
          <div className="w-12 h-12 rounded-full bg-[#ECFAF2] flex items-center justify-center text-[#094029] mb-4">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-[#1A1714]">{label}</p>
          <p className="text-[11px] text-[#7A746C] mt-1">
            Drag & drop your file here, or click to browse
          </p>
          <p className="text-[9px] text-[#A09890] mt-3.5 uppercase tracking-widest font-bold">
            Supports: {allowedTypes.join(", ")} (Max: {maxSizeMB}MB)
          </p>
        </div>
      ) : (
        <div className="bg-white/70 backdrop-blur-[20px] border border-white/90 rounded-[20px] p-5 shadow-[0_4px_16px_rgba(9,64,41,0.04)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[12px] bg-[#F0EDE8] flex items-center justify-center text-[#4A4540]">
                <File className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <p className="text-xs font-bold text-[#1A1714] truncate max-w-[200px] sm:max-w-xs font-[family-name:var(--font-heading)] uppercase tracking-wider">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-[#A09890] mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>

            {uploadProgress === null && (
              <button
                onClick={handleClearFile}
                className="w-8 h-8 flex items-center justify-center text-[#A09890] hover:text-[#B91C1C] hover:bg-[#FEE2E2]/60 rounded-full cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Upload progress indicator */}
          {uploadProgress !== null && (
            <div className="mt-4">
              <div className="h-1.5 w-full bg-[#EAE7E0]/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#094029] to-[#148F58] transition-all duration-150 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#7A746C] mt-2">
                <span className="font-bold uppercase tracking-wider">Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          )}

          {uploadProgress === null && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleUploadSubmit} variant="primary" size="sm">
                Submit File
              </Button>
            </div>
          )}
        </div>
      )}

      {error && (
        <Alert variant="error" className="mt-3" icon={<AlertTriangle className="w-4 h-4" />}>
          {error}
        </Alert>
      )}
    </div>
  );
};
