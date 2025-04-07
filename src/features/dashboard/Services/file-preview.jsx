"use client";

import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  FileText,
  ImageIcon,
  FileIcon as FilePresentation,
  FileSpreadsheet,
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
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);

      // For PDFs, ensure we have a valid URL that can be used in an iframe
      if (fileType.includes("pdf")) {
        // If it's a File object URL (blob:), we need to use it directly
        if (url.startsWith("blob:")) {
          setPdfUrl(url);
        }
        // If it's a server URL, make sure it's properly formatted
        else if (url.startsWith("http")) {
          setPdfUrl(url);
        }
        // If it's a relative path, prepend API_URL
        else {
          setPdfUrl(`${API_URL}${url}`);
        }
      }
    }
  }, [isOpen, url, fileType]);

  const getFileIcon = () => {
    if (fileType.includes("pdf"))
      return <FileText className="h-16 w-16 text-muted-foreground" />;
    if (fileType.includes("image"))
      return <ImageIcon className="h-16 w-16 text-muted-foreground" />;
    if (fileType.includes("presentation") || fileType.includes("ppt"))
      return <FilePresentation className="h-16 w-16 text-muted-foreground" />;
    if (fileType.includes("sheet") || fileType.includes("xls"))
      return <FileSpreadsheet className="h-16 w-16 text-muted-foreground" />;
    return <FileQuestion className="h-16 w-16 text-muted-foreground" />;
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError("Impossible de charger l'aperçu du document.");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="h-[80vh] max-w-4xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {fileName || "Aperçu du document"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="flex-1 overflow-hidden rounded-md bg-muted/10">
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
              <Button variant="outline" size="sm" onClick={onClose}>
                Fermer
              </Button>
            </div>
          )}

          {fileType.includes("pdf") ? (
            <iframe
              src={pdfUrl}
              className="h-full w-full"
              title="PDF Preview"
              onLoad={handleLoad}
              onError={handleError}
              style={{ display: loading || error ? "none" : "block" }}
            />
          ) : fileType.includes("image") ? (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={url || "/placeholder.svg"}
                alt={fileName || "Image preview"}
                className="max-h-full max-w-full object-contain"
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, "_blank")}
              >
                Télécharger
              </Button>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Fermer</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
