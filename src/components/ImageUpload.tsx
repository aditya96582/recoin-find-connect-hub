import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, className }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return; // 5MB limit
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  if (value) {
    return (
      <div className={`relative rounded-lg overflow-hidden border border-border ${className}`}>
        <img src={value} alt="Upload preview" className="w-full h-40 object-cover" />
        <Button
          type="button"
          size="icon"
          variant="destructive"
          className="absolute top-2 right-2 h-7 w-7"
          onClick={() => onChange(undefined)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors ${
        dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
      } ${className}`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      <ImageIcon className="h-8 w-8 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Drop an image here or <span className="text-primary font-medium">browse</span>
      </p>
      <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
    </div>
  );
};

export default ImageUpload;
