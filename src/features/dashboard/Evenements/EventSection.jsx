import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EventSection({ section, onRemove }) {
  return (
    <div className="mb-4 rounded-lg border border-muted bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-lg font-medium">{section.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {section.image && (
        <div className="mb-4">
          <img
            src={section.image || "/placeholder.svg"}
            alt={section.title}
            className="h-48 w-full rounded-md object-cover"
          />
        </div>
      )}

      <p className="whitespace-pre-wrap text-muted-foreground">
        {section.content}
      </p>
    </div>
  );
}
