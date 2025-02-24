import { AlertCircle } from "lucide-react"; // Icon from ShadCN's Lucide icons

function ErrorElement({ errorMessage, onRetry }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-lg border bg-red-100 p-6 text-red-800 shadow-sm">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6" />
        <h2 className="text-lg font-semibold">Failed to Load Questions</h2>
      </div>
      <p className="text-center">
        {errorMessage ||
          "An unexpected error occurred while loading the questions."}
      </p>
      {/* <button
        onClick={onRetry}
        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring focus:ring-red-300"
      >
        Retry
      </button> */}
    </div>
  );
}

export default ErrorElement;
