import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircleQuestion, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EmptyQuestions() {
  const navigate = useNavigate();
  return (
    <Card className="w-full border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-4 p-6 text-center">
        <div className="rounded-full bg-primary/10 p-3">
          <MessageCircleQuestion className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold tracking-tight">Aucune question</h3>
          <p className="text-sm text-muted-foreground">
            Aucune question n&apos;est encore disponible. Commencez par en poser
            une !
          </p>
        </div>
        <Button
          onClick={() => navigate("/questions/patients/ajouter")}
          className="gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Ajouter une question
        </Button>
      </CardContent>
    </Card>
  );
}
