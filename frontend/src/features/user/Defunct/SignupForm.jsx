import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
/* ---------------------------------------------------------------------------
   3) SignupForm Component
      - Uses react-hook-form with signupSchema
--------------------------------------------------------------------------- */
const signupSchema = z
  .object({
    email: z.string().email("Veuillez saisir un email valide."),
    nom: z.string().min(1, "Veuillez saisir votre nom."),
    prenom: z.string().min(1, "Veuillez saisir votre prénom."),
    password: z
      .string()
      .min(1, "Veuillez saisir un mot de passe.")
      .regex(/^[a-z0-9]+$/i, "Le mot de passe doit être alphanumérique."),
    confirmPassword: z.string().min(1, "Veuillez confirmer le mot de passe."),
    userType: z.enum(["patient", "etudiant"]),
  })
  // Ensure passwords match
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"], // attach error to confirmPassword
  });

export default function SignupForm({
  onToggleForm,
  onTogglePasswords,
  showPasswords,
  closeDialog,
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      userType: "patient", // default radio selection
    },
  });

  const onSubmit = (data) => {
    // data has { email, nom, prenom, password, confirmPassword, userType }
    console.log("Signup data:", data);
    alert("Signup successful!");
    closeDialog();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <DialogHeader>
        <DialogTitle>Sign up</DialogTitle>
      </DialogHeader>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="Saisissez votre email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      {/* Nom */}
      <div className="space-y-2">
        <Label htmlFor="nom">Nom</Label>
        <Input
          id="nom"
          placeholder="Saisissez votre nom"
          {...register("nom")}
        />
        {errors.nom && (
          <p className="text-sm text-red-600">{errors.nom.message}</p>
        )}
      </div>

      {/* Prénom */}
      <div className="space-y-2">
        <Label htmlFor="prenom">Prénom</Label>
        <Input
          id="prenom"
          placeholder="Saisissez votre prénom"
          {...register("prenom")}
        />
        {errors.prenom && (
          <p className="text-sm text-red-600">{errors.prenom.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="signup-password">Mot de passe</Label>
        <div className="relative">
          <Input
            id="signup-password"
            type={showPasswords ? "text" : "password"}
            placeholder="Saisissez votre mot de passe"
            {...register("password")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePasswords}
          >
            {showPasswords ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmez le mot de passe</Label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={showPasswords ? "text" : "password"}
            placeholder="Saisissez à nouveau votre mot de passe"
            {...register("confirmPassword")}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={onTogglePasswords}
          >
            {showPasswords ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Patient / Étudiant */}
      <RadioGroup
        className="space-y-2"
        // "onValueChange" => react-hook-form uses register
        // but we can also manually pass setValue. Let's do a simpler approach:
        {...register("userType")}
        // NOTE: If you prefer to watch userType changes, you can:
        // value={watch("userType")} onValueChange={(val) => setValue("userType", val)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="patient" id="patient" />
          <Label htmlFor="patient">Patient</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="etudiant" id="etudiant" />
          <Label htmlFor="etudiant">Étudiant</Label>
        </div>
      </RadioGroup>
      {errors.userType && (
        <p className="text-sm text-red-600">{errors.userType.message}</p>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full bg-[#00A3B5] hover:bg-[#00919F]">
        Continuer
      </Button>

      {/* Switch to Login */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Vous avez déjà un compte ?{" "}
        </span>
        <Button
          variant="link"
          type="button"
          className="text-[#00A3B5]"
          onClick={onToggleForm}
        >
          Connectez-vous
        </Button>
      </div>
    </form>
  );
}
