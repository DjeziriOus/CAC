import { AlertCircle, AlertCircleIcon, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

function AlertElement({
  errorMessage = "une erreur est survenue quelque part ...",
}) {
  return (
    <div className="absolute right-10 top-[92vh] overflow-hidden rounded-lg bg-red-100">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>{errorMessage}</AlertDescription>
      </Alert>
    </div>
  );
}

export default AlertElement;
