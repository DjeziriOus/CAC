import { Card, CardContent } from "@/components/ui/card";
import { MailWarning } from "lucide-react";

export function ErrorQuestions() {
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-red-500/10 p-3">
          <MailWarning className="h-8 w-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold tracking-tight">
            Serveur indisponibl e
          </h3>
          <p className="text-sm text-muted-foreground">
            Erreur lors de la connexion au serveur: Serveur indisponible
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
