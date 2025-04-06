"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash,
  FileText,
  FileImage,
  FileIcon as FilePresentation,
  File,
} from "lucide-react";
import FilePreview from "./file-preview";

export default function MultiFileUpload({
  onFilesChange,
  maxFiles = 10,
  maxSize = 10, // 10MB default
  accept = "image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx",
  className = "",
}) {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);

    // Check if adding these files would exceed the max
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`Vous ne pouvez pas ajouter plus de ${maxFiles} fichiers.`);
      return;
    }

    // Check file sizes
    const oversizedFiles = selectedFiles.filter(
      (file) => file.size > maxSize * 1024 * 1024,
    );
    if (oversizedFiles.length > 0) {
      setError(
        `Certains fichiers dépassent la taille maximale de ${maxSize}MB.`,
      );
      return;
    }

    // Process valid files
    const newFiles = selectedFiles.map((file) => {
      const fileType = file.type;
      let preview = "";

      // Create preview URLs for images
      if (fileType.startsWith("image/")) {
        preview = URL.createObjectURL(file);
      }

      return {
        file,
        preview,
        type: fileType,
      };
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));
    setError(null);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    const updatedFiles = [...files];

    // Revoke object URL if it's an image
    if (updatedFiles[index].preview) {
      URL.revokeObjectURL(updatedFiles[index].preview);
    }

    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles.map((f) => f.file));
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith("image/")) return <FileImage className="h-8 w-8" />;
    if (fileType.includes("pdf")) return <FileText className="h-8 w-8" />;
    if (fileType.includes("presentation") || fileType.includes("ppt"))
      return <FilePresentation className="h-8 w-8" />;
    return <File className="h-8 w-8" />;
  };

  const handlePreview = (file) => {
    setPreviewFile(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept={accept}
        className="hidden"
      />

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="group relative rounded-md border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                {getFileIcon(file.type)}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-medium">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-2">
              {(file.type.startsWith("image/") ||
                file.type.includes("pdf")) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePreview(file)}
                >
                  Aperçu
                </Button>
              )}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <Trash className="mr-1 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </div>
        ))}

        {files.length < maxFiles && (
          <div
            onClick={openFileSelector}
            className="flex aspect-video cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-border bg-muted/10 p-6 transition-colors hover:bg-accent/50"
          >
            <Plus className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-center font-medium">Ajouter des fichiers</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              {`${files.length}/${maxFiles} fichiers ajoutés`}
            </p>
          </div>
        )}
      </div>

      {previewFile && (
        <FilePreview
          url={previewFile.preview || URL.createObjectURL(previewFile.file)}
          fileName={previewFile.file.name}
          fileType={previewFile.type}
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}
