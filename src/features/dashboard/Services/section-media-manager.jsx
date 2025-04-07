"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileImage, FilePlus, Trash, Eye } from "lucide-react";
import MultiFileUpload from "./multi-file-upload";
import FilePreview from "./file-preview";
import { API_URL } from "@/utils/constants";

export default function SectionMediaManager({
  media = [],
  onMediaChange,
  onNewFilesChange,
}) {
  const [activeTab, setActiveTab] = useState("all");
  const [previewItem, setPreviewItem] = useState(null);
  const [newFiles, setNewFiles] = useState([]);

  // Process new files when they're added
  useEffect(() => {
    onNewFilesChange(newFiles);
  }, [newFiles, onNewFilesChange]);

  const handleNewFiles = (files) => {
    setNewFiles(files);

    // Create media items from the new files
    const newMediaItems = files.map((file) => {
      const fileType =
        file.type.split("/")[0] === "image"
          ? "image"
          : file.type.includes("pdf")
            ? "pdf"
            : file.type.includes("presentation")
              ? "ppt"
              : "file";

      return {
        type: fileType,
        url: URL.createObjectURL(file),
        name: file.name,
      };
    });

    // Update the media array with both existing and new items
    const existingMedia = media.filter((item) => !item.url.startsWith("blob:"));
    onMediaChange([...existingMedia, ...newMediaItems]);
  };

  const removeMediaItem = (index) => {
    const updatedMedia = [...media];
    const removedItem = updatedMedia.splice(index, 1)[0];

    // If it's a blob URL, revoke it
    if (removedItem.url.startsWith("blob:")) {
      URL.revokeObjectURL(removedItem.url);

      // Also remove from newFiles if it's a new file
      const fileIndex = newFiles.findIndex(
        (file) => file.name === removedItem.name,
      );

      if (fileIndex !== -1) {
        const updatedFiles = [...newFiles];
        updatedFiles.splice(fileIndex, 1);
        setNewFiles(updatedFiles);
      }
    }

    onMediaChange(updatedMedia);
  };

  const filteredMedia =
    activeTab === "all"
      ? media
      : media.filter((item) => item.type === activeTab);

  return (
    <div className="space-y-4">
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
                        src={
                          item.url.startsWith("blob:") ||
                          item.url.startsWith("http")
                            ? item.url
                            : API_URL + item.url || "/placeholder.svg"
                        }
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
                      onClick={() => setPreviewItem(item)}
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
                  src={
                    item.url.startsWith("blob:") || item.url.startsWith("http")
                      ? item.url
                      : API_URL + item.url || "/placeholder.svg"
                  }
                  alt={item.name}
                  className="h-full w-full rounded-md object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewItem(item)}
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
                    onClick={() => setPreviewItem(item)}
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

      <div className="mt-6">
        <h3 className="mb-4 text-lg font-medium">Ajouter des fichiers</h3>
        <MultiFileUpload
          onFilesChange={handleNewFiles}
          maxFiles={10}
          maxSize={10}
        />
      </div>

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
