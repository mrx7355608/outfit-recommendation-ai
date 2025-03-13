"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImageUploadProps {
  onImageUpload?: (file: File) => void;
  className?: string;
}

export function ImageUpload({ onImageUpload, className }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Create preview
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setPreview(reader.result as string);
    };

    // Call callback if provided
    if (onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2",
        dragActive
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/20",
        preview ? "h-auto" : "h-40",
        className,
      )}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        onChange={handleChange}
        name="file-upload"
        id="user-file-upload"
        className="inline opacity-0"
      />

      {preview ? (
        <div className="w-full">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            className="max-h-64 mx-auto object-contain rounded-md"
            width={200}
            height={200}
          />
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleButtonClick}
          >
            Change Image
          </Button>
        </div>
      ) : (
        <>
          <Upload className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground text-center">
            Upload your image
          </p>
          <p className="text-xs text-muted-foreground/70 text-center">
            Drag and drop or click to browse
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={handleButtonClick}
          >
            Select File
          </Button>
        </>
      )}
    </div>
  );
}
