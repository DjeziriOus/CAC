"use client";

import React, { useCallback } from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileImage,
  FilePlus,
  Trash,
  Eye,
  Upload,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import FilePreview from "./file-preview";
import { toast } from "sonner";
import { formatDate } from "date-fns";
import moment from "moment";
/**
 * Validates and processes multiple files of various types and returns enriched metadata
 *
 * @param {FileList|File[]} files - Single file or multiple files to process
 * @param {Function} onFileSelect - Callback when files are successfully processed
 * @param {Object} options - Optional configuration
 * @param {number} options.maxSizeMB - Maximum file size in MB (default: 5MB)
 * @param {string[]} options.allowedTypes - Array of allowed MIME types or extensions
 * @returns {void}
 */
function validateAndProcessFiles(files, onFileSelect, options = {}) {
  // Default options
  const config = {
    maxSizeMB: options.maxSizeMB || 5,
    allowedTypes: options.allowedTypes || [
      // Images
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      // Documents
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  };

  // Convert FileList to array if needed
  const fileArray = Array.from(files);

  // Check if there are files to process
  if (!fileArray.length) {
    toast.error("Erreur lors de l'ajout", {
      description: "Aucun fichier sélectionné.",
    });
    return;
  }

  // Create an array to store processed files
  const processedFiles = [];
  let errorOccurred = false;
  let filesProcessed = 0;

  // Calculate max size in bytes
  const maxSizeBytes = config.maxSizeMB * 1024 * 1024;

  // Process each file
  fileArray.forEach((file) => {
    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error("Erreur lors de l'ajout", {
        description: `Fichier "${file.name}" trop volumineux. Limite: ${config.maxSizeMB}MB`,
      });
      errorOccurred = true;
      filesProcessed++;
      checkIfComplete();
      return;
    }

    // Validate file type
    const fileType = file.type;
    const fileExtension = file.name.split(".").pop().toLowerCase();

    // Check if file type is allowed
    const isAllowedType = config.allowedTypes.some((type) => {
      // Check for direct match of MIME type
      if (fileType === type) return true;
      // Check for extension match
      if (type.startsWith(".") && `.${fileExtension}` === type) return true;
      // Check for wildcard image type
      if (type === "image/*" && fileType.startsWith("image/")) return true;
      return false;
    });

    if (!isAllowedType) {
      toast.error("Erreur lors de l'ajout", {
        description: `Type de fichier non pris en charge: ${file.name}`,
      });
      errorOccurred = true;
      filesProcessed++;
      checkIfComplete();
      return;
    }

    // Process file based on type
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileData = e.target.result;

      // Get simplified file type for easier frontend handling
      const simpleFileType = getSimpleFileType(fileType, fileExtension);

      // Get human-readable file size
      const humanReadableSize = formatFileSize(file.size);

      // For images, validate the content
      if (fileType.startsWith("image/")) {
        validateImage(fileData, file.name, (isValid) => {
          if (isValid) {
            processedFiles.push({
              name: file.name,
              mimeType: fileType,
              type: simpleFileType,
              extension: fileExtension,
              size: file.size,
              humanReadableSize,
              data: fileData,
              lastModified: file.lastModified,
            });
          } else {
            errorOccurred = true;
          }

          filesProcessed++;
          checkIfComplete();
        });
      } else {
        // For non-image files, just add them to processed files
        processedFiles.push({
          name: file.name,
          mimeType: fileType,
          type: simpleFileType,
          extension: fileExtension,
          size: file.size,
          humanReadableSize,
          data: fileData,
          lastModified: file.lastModified,
        });

        filesProcessed++;
        checkIfComplete();
      }
    };

    reader.onerror = () => {
      toast.error("Erreur lors de l'ajout", {
        description: `Erreur lors de la lecture du fichier: ${file.name}`,
      });
      errorOccurred = true;
      filesProcessed++;
      checkIfComplete();
    };

    reader.readAsDataURL(file);
  });

  // Helper function to get human-readable file size
  function formatFileSize(bytes) {
    if (bytes === 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + " " + sizes[i];
  }

  // Helper function to get simplified file type
  function getSimpleFileType(mimeType, extension) {
    if (mimeType.startsWith("image/")) {
      return "image";
    } else if (mimeType === "application/pdf" || extension === "pdf") {
      return "pdf";
    } else if (
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation" ||
      extension === "ppt" ||
      extension === "pptx"
    ) {
      return "ppt";
    } else if (
      mimeType === "application/msword" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      extension === "doc" ||
      extension === "docx"
    ) {
      return "doc";
      //TODO: add this case in tabs
    } else if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      extension === "xls" ||
      extension === "xlsx"
    ) {
      return "spreadsheet";
    } else {
      return "file";
    }
  }

  // Helper function to validate image data
  function validateImage(imageData, fileName, callback) {
    const tempImg = document.createElement("img");

    tempImg.onload = () => {
      callback(true); // Image is valid
    };

    tempImg.onerror = () => {
      toast.error("Erreur lors de l'ajout", {
        description: `Erreur lors de la validation de l'image: ${fileName}`,
      });
      callback(false); // Image is invalid
    };

    tempImg.src = imageData;
  }

  // Check if all files have been processed and call the callback
  function checkIfComplete() {
    if (filesProcessed === fileArray.length) {
      if (!errorOccurred && processedFiles.length > 0) {
        // If only one file, just return the file object
        if (processedFiles.length === 1) {
          onFileSelect(processedFiles);
        } else {
          // If multiple files, return array of file objects
          onFileSelect(processedFiles);
        }
      } else if (processedFiles.length === 0) {
        // toast.error("Erreur lors de l'ajout", {
        //   description: "Aucun fichier valide n'a pu être traité.",
        // });
      }
    }
  }
}

export default function SectionMediaManager({
  media = [],
  onMediaChange,
  onMediaAdd,
  onMediaRemove,
  onNewFilesChange,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [previewItem, setPreviewItem] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  // const handleFiles = (files) => {
  //   if (!files) return;

  //   const fileArray = Array.from(files);
  //   const newMediaItems = [];
  //   const newFiles = [];

  //   fileArray.forEach((file) => {
  //     let fileType = "file";

  //     // Determine file type based on MIME type
  //     if (file.type.startsWith("image/")) {
  //       fileType = "image";
  //     } else if (file.type.includes("pdf")) {
  //       fileType = "pdf";
  //     } else if (
  //       file.type.includes("presentation") ||
  //       file.type.includes("ppt")
  //     ) {
  //       fileType = "ppt";
  //     }
  //     newMediaItems.push({
  //       type: fileType,
  //       url: URL.createObjectURL(file),
  //       name: file.name,
  //       file: file, // Store the file for upload
  //     });

  //     newFiles.push(file);
  //   });

  //   // Update the media array with both existing and new items
  //   const existingMedia = media.filter((item) => !item.url.startsWith("blob:"));
  //   const updatedMedia = [...existingMedia, ...newMediaItems];

  //   onMediaChange(updatedMedia);
  //   onNewFilesChange(newFiles);
  // };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  // const handleDrop = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   setDragActive(false);
  //   if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
  //     handleFiles(e.dataTransfer.files);
  //   }
  // };
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = e.dataTransfer.files;
      if (files) {
        validateAndProcessFiles(files, onMediaAdd);
      }
    },
    [onMediaAdd],
  );

  // const handleFileInputChange = (e) => {
  //   // console.log(e.target.files[0]);
  //   // console.log(URL.createObjectURL(e.target.files[0]));
  //   handleFiles(e.target.files);
  //   // Reset the input value so the same file can be selected again
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  // };

  const handleChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files) {
        validateAndProcessFiles(files, onMediaAdd);
      }
    },
    [onMediaAdd],
  );

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  // const removeMediaItem = (index) => {
  //   const updatedMedia = [...media];
  //   const removedItem = updatedMedia.splice(index, 1)[0];

  //   // If it's a blob URL, revoke it
  //   if (removedItem.url.startsWith("blob:")) {
  //     URL.revokeObjectURL(removedItem.url);
  //   }

  //   onMediaChange(updatedMedia);

  //   // Update the files list for upload
  //   const filesToUpload = updatedMedia
  //     .filter((item) => item.file)
  //     .map((item) => item.file);

  //   onNewFilesChange(filesToUpload);
  // };

  const handlePreviewFile = (item) => {
    setPreviewItem(item);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-8 w-8" />;
      case "image":
        return <FileImage className="h-8 w-8" />;
      case "ppt":
        return <FilePlus className="h-8 w-8" />;
      case "spreadsheet":
        return <FileSpreadsheet className="h-8 w-8" />;
      default:
        return <FilePlus className="h-8 w-8" />;
    }
  };

  const filteredMedia =
    activeTab === "all"
      ? media
      : media.filter((item) => item.type === activeTab);
  console.log(filteredMedia);
  return (
    <div className="space-y-4">
      {media.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="h-12 w-[100%]">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="ppt">Présentations</TabsTrigger>
            <TabsTrigger value="file">Autres</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-md border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    {item.type === "image" ? (
                      <div className="h-12 w-12 overflow-hidden rounded-md">
                        <img
                          src={
                            item?.data
                              ? item?.data
                              : item?.url
                                ? item.url
                                : "/placeholder.svg"
                          }
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      // <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      //   <FileImage className="h-8 w-8" />
                      // </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        {getFileIcon(item.type)}
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type}
                        {item.extension && ` de type .${item.extension}`}
                        {item.size && ` • ${item.humanReadableSize}`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Derniere modifcation :{" "}
                        {item.lastModified !== "" &&
                          `${moment(item.lastModified).format("DD/MM/YYYY - h:mm A")}`}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    {(item.type === "image" || item.type === "pdf") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreviewFile(item)}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Aperçu
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaRemove(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          {/* onClick={() => onMediaRemove(index)} */}

          <TabsContent value="image" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div key={index} className="group relative aspect-video">
                  <img
                    src={
                      item?.data
                        ? item?.data
                        : item?.url
                          ? item.url
                          : "/placeholder.svg"
                    }
                    alt={item.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewFile(item)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Aperçu
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaRemove(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pdf" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-md border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">PDF</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreviewFile(item)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      Aperçu
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaRemove(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ppt" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-md border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <FilePlus className="h-8 w-8" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Présentation
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaRemove(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="file" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div
                  key={index}
                  className="group relative rounded-md border border-border bg-card p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <FilePlus className="h-8 w-8" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Fichier</p>
                    </div>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onMediaRemove(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      <div
        className={`relative rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragActive ? "border-primary bg-primary/5" : "border-border"
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          // onChange={handleFileInputChange}
          onChange={handleChange}
          accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <Upload className="h-10 w-10 text-muted-foreground" />
          <h3 className="text-lg font-medium">
            Déposez vos fichiers ici ou cliquez pour parcourir
          </h3>
          <p className="text-sm text-muted-foreground">
            Images, PDF, PPT, DOC, XLS
          </p>
          <Button variant="outline" onClick={openFileSelector} className="mt-2">
            Parcourir les fichiers
          </Button>
        </div>
      </div>

      {previewItem && (
        <FilePreview
          url={
            previewItem?.data
              ? previewItem?.data
              : previewItem?.url
                ? previewItem.url
                : "/placeholder.svg"
          }
          fileName={previewItem.name}
          fileType={previewItem.type}
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
}
