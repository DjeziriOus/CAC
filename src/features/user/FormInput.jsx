import { Input } from "@/components/ui/input";

function FormInput({ field, error, placeholder }) {
  return (
    <Input
      placeholder={placeholder}
      className={
        error
          ? "h-auto border-destructive bg-red-100 py-3"
          : "h-auto bg-blue-input-bg py-3 text-blue-2 placeholder:text-blue-2"
      }
      {...field}
    />
  );
}

export default FormInput;
