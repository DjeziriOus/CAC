import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({
  field,
  error,
  handleTogglePassword,
  showPassword,
  placeholder = "Saisissez votre mot de passe...",
}) {
  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={
          error
            ? "h-auto border-destructive bg-red-100 py-3"
            : "h-auto bg-blue-input-bg py-3 text-blue-2 placeholder:text-blue-2"
        }
        {...field}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full p-4 hover:bg-[#c1e1f396]"
        onClick={handleTogglePassword}
      >
        {showPassword ? (
          <EyeOff size={18} className="text-blue-2" />
        ) : (
          <Eye size={18} className="text-blue-2" />
        )}
      </Button>
    </div>
  );
}

export default PasswordInput;
