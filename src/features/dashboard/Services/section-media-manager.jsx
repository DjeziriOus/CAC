"use client";

import React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, FilePlus, Trash, Eye, Upload } from "lucide-react";
import FilePreview from "./file-preview";

export default function SectionMediaManager({
  media = [],
  onMediaChange,
  onNewFilesChange,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [previewItem, setPreviewItem] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleFiles = (files) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const newMediaItems = [];
    const newFiles = [];

    fileArray.forEach((file) => {
      let fileType = "file";

      // Determine file type based on MIME type
      if (file.type.startsWith("image/")) {
        fileType = "image";
      } else if (file.type.includes("pdf")) {
        fileType = "pdf";
      } else if (
        file.type.includes("presentation") ||
        file.type.includes("ppt")
      ) {
        fileType = "ppt";
      }

      newMediaItems.push({
        type: fileType,
        url: URL.createObjectURL(file),
        name: file.name,
        file: file, // Store the file for upload
      });

      newFiles.push(file);
    });

    // Update the media array with both existing and new items
    const existingMedia = media.filter((item) => !item.url.startsWith("blob:"));
    const updatedMedia = [...existingMedia, ...newMediaItems];

    onMediaChange(updatedMedia);
    onNewFilesChange(newFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    handleFiles(e.target.files);
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const removeMediaItem = (index) => {
    const updatedMedia = [...media];
    const removedItem = updatedMedia.splice(index, 1)[0];

    // If it's a blob URL, revoke it
    if (removedItem.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedItem.url);
    }

    onMediaChange(updatedMedia);

    // Update the files list for upload
    const filesToUpload = updatedMedia
      .filter((item) => item.file)
      .map((item) => item.file);

    onNewFilesChange(filesToUpload);
  };

  const handlePreviewFile = (item) => {
    setPreviewItem(item);
  };

  const filteredMedia =
    activeTab === "all"
      ? media
      : media.filter((item) => item.type === activeTab);

  return (
    <div className="space-y-4">
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
          onChange={handleFileInputChange}
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

      {media.length > 0 && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
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
                          src={item.url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <FileImage className="h-8 w-8" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type.toUpperCase()}
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
                      onClick={() => removeMediaItem(index)}
                    >
                      <Trash className="mr-1 h-4 w-4" />
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="image" className="mt-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMedia.map((item, index) => (
                <div key={index} className="group relative aspect-video">
                  <img
                    src={item.url || "/placeholder.svg"}
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
                      onClick={() => removeMediaItem(index)}
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
                      <FileImage className="h-8 w-8" />
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
                      onClick={() => removeMediaItem(index)}
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
                      onClick={() => removeMediaItem(index)}
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
                      onClick={() => removeMediaItem(index)}
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

      {previewItem && (
        <FilePreview
          url={previewItem.url}
          fileName={previewItem.name}
          fileType={previewItem.type}
          isOpen={!!previewItem}
          onClose={() => setPreviewItem(null)}
        />
      )}
    </div>
  );
}
