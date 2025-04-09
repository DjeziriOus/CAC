"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ImageIcon,
  FileIcon as FilePresentation,
  FileSpreadsheet,
  FileCode,
  FileQuestion,
} from "lucide-react";
import { API_URL } from "@/utils/constants";

export default function FilePreview({
  url,
  fileName,
  fileType,
  isOpen,
  onClose,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [isBase64, setIsBase64] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      // Check if the URL is a base64 data URL
      if (url && url.startsWith("data:")) {
        console.log(url);
        setIsBase64(true);

        // For PDFs we can use the data URL directly in the iframe
        if (url.includes("application/pdf")) {
          setFileUrl(url);
        }
        // For images we can also use the data URL directly
        else if (url.includes("image/")) {
          setFileUrl(url);
        }
        // For other file types we can't preview directly with base64
        else {
          setFileUrl(url);
        }
      }
      // Handle regular URLs
      else {
        setIsBase64(false);

        // If it's a File object URL (blob:), we need to use it directly
        if (url && url.startsWith("blob:")) {
          setFileUrl(url);
        }
        // If it's a server URL, make sure it's properly formatted
        else if (url && url.startsWith("http")) {
          setFileUrl(url);
        }
        // If it's a relative path, prepend API_URL
        else if (url) {
          setFileUrl(`${API_URL}${url}`);
        }
      }
    }
  }, [isOpen, url, fileType]);

  // Determine actual file type from URL or fileType prop
  const determineFileType = () => {
    // First check the data URL content type if it's base64
    if (isBase64 && url) {
      if (url.includes("application/pdf")) return "pdf";
      if (url.includes("image/")) return "image";
      if (
        url.includes("application/vnd.ms-powerpoint") ||
        url.includes("presentation")
      )
        return "ppt";
      if (
        url.includes("application/msword") ||
        url.includes("officedocument.wordprocessingml")
      )
        return "doc";
      if (
        url.includes("application/vnd.ms-excel") ||
        url.includes("spreadsheetml")
      )
        return "xls";
    }

    // Fall back to the fileType prop
    if (fileType) {
      if (fileType.includes("pdf")) return "pdf";
      if (fileType.includes("image")) return "image";
      if (fileType.includes("presentation") || fileType.includes("ppt"))
        return "ppt";
      if (fileType.includes("word") || fileType.includes("doc")) return "doc";
      if (fileType.includes("sheet") || fileType.includes("xls")) return "xls";
    }

    // Check file extension in the name as last resort
    if (fileName) {
      const extension = fileName.split(".").pop().toLowerCase();
      if (extension === "pdf") return "pdf";
      if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(extension))
        return "image";
      if (["ppt", "pptx"].includes(extension)) return "ppt";
      if (["doc", "docx"].includes(extension)) return "doc";
      if (["xls", "xlsx"].includes(extension)) return "xls";
    }

    return "unknown";
  };

  const actualFileType = determineFileType();

  const getFileIcon = () => {
    switch (actualFileType) {
      case "pdf":
        return <FileText className="h-16 w-16 text-muted-foreground" />;
      case "image":
        return <ImageIcon className="h-16 w-16 text-muted-foreground" />;
      case "ppt":
        return <FilePresentation className="h-16 w-16 text-muted-foreground" />;
      case "doc":
        return <FileCode className="h-16 w-16 text-muted-foreground" />;
      case "xls":
        return <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />;
      default:
        return <FileQuestion className="h-16 w-16 text-muted-foreground" />;
    }
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError("Impossible de charger l'aperçu du document.");
  };

  // Create a download link for base64 data
  const downloadBase64File = () => {
    if (!isBase64 || !fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create a blob URL from base64 for certain file types
  // This is needed because some browsers can't display PDFs directly from data URLs
  const createBlobUrl = () => {
    if (!isBase64 || !fileUrl) return null;

    try {
      // Extract the MIME type and base64 data
      const [mimePart, base64Part] = fileUrl.split(",");
      const mime = mimePart.split(":")[1].split(";")[0];

      // Convert base64 to binary
      const binary = atob(base64Part);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }

      // Create blob and URL
      const blob = new Blob([array], { type: mime });
      return URL.createObjectURL(blob);
    } catch (e) {
      console.error("Error creating blob URL:", e);
      return null;
    }
  };

  // For PDFs, we might need a blob URL for some browsers
  const effectiveFileUrl =
    actualFileType === "pdf" && isBase64 ? createBlobUrl() || fileUrl : fileUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="h-[95vh] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{fileName || "Aperçu du document"}</DialogTitle>
        </DialogHeader>
        <div className="h-[80dvh] flex-1 overflow-hidden rounded-md bg-muted/10">
          {loading && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">
                  Chargement de l&apos;aperçu...
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              {getFileIcon()}
              <p className="text-center text-muted-foreground">{error}</p>
              {isBase64 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBase64File}
                >
                  Télécharger
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                Fermer
              </Button>
            </div>
          )}

          {actualFileType === "pdf" ? (
            <iframe
              src={effectiveFileUrl}
              className="h-full w-full"
              title="PDF Preview"
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: loading || error ? "none" : "block" }}
            />
          ) : actualFileType === "image" ? (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={fileUrl || "/placeholder.svg"}
                alt={fileName || "Image preview"}
                className="max-h-full max-w-full overflow-hidden rounded-md object-contain"
                onLoad={handleLoad}
                onError={handleError}
                style={{ display: loading || error ? "none" : "block" }}
              />
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-4">
              {getFileIcon()}
              <p className="text-center text-muted-foreground">
                L&apos;aperçu n&apos;est pas disponible pour ce type de fichier.
              </p>
              {isBase64 ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadBase64File}
                >
                  Télécharger
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(fileUrl, "_blank")}
                >
                  Télécharger
                </Button>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Fermer</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
