import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Redux action

// UI Components
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import PasswordInput from "./PasswordInput";
import FormInput from "./FormInput";

/**
 * Zod schema for the login form
 */
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(3, {
    message: "Le mot de passe doit contenir au moins 3 caractères.",
  }),
  rememberMe: z.boolean().default(false),
});

/**
 * A reusable LoginForm that:
 * - uses react-hook-form + zod
 * - dispatches Redux login on submit
 * - shows server errors
 * - includes show/hide password
 */

// TODO: to='#'
export default function LoginForm({ toggleForm }) {
  // const { isConnecting, error, loginUser } = useLogin();
  const { isConnecting, error, hasAuthError, loginUser } = useLogin();

  // Show/hide password local state
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // RHF
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  useEffect(() => {
    if (hasAuthError) {
      form.setError("email", {
        message: "Identifiants incorrects. Veuillez réessayer.",
      });
      form.setError("password", {
        message: "Identifiants incorrects. Veuillez réessayer.",
      });
    }
  }, [hasAuthError, form]);
  const onSubmit = (values) => {
    form.clearErrors(); // Clear any previous form errors
    loginUser({ email: values.email, password: values.password });
    navigate("/");
  };
  // const onSubmit = (values) => {

  // Move navigation logic to a useEffect that watches for authentication state
  // or handle it in the onSuccess callback of the mutation
  // };
  // Toggles password field type
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <DialogTitle>
        <div className="mb-2 text-2xl font-bold">Login</div>
      </DialogTitle>
      <div className="mb-4 text-muted-foreground">
        Connectez-vous pour plus d&apos;options et poser vos questions en Q&A.
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : "text-primary"}>
                  Email
                </FormLabel>
                <FormControl>
                  <FormInput
                    field={field}
                    error={error || hasAuthError}
                    placeholder="Saisissez votre email..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password (with show/hide) */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : "text-primary"}>
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    error={error || hasAuthError}
                    handleTogglePassword={handleTogglePassword}
                    showPassword={showPassword}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Remember me + forgot password */}
          <div className="flex items-center justify-between">
            <FormField
              control={form.control}
              name="rememberMe"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="text-sm font-normal">
                    Se souvenir de moi
                  </FormLabel>
                </FormItem>
              )}
            />
            <Button variant="link" className="px-0">
              Mot de passe oublié ?
            </Button>
          </div>

          {/* Server error */}
          {/* {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )} */}

          <Button
            type="submit"
            className="w-full"
            disabled={isConnecting || form.formState.isSubmitting}
          >
            {isConnecting || form.formState.isSubmitting
              ? "Connexion..."
              : "Login"}
          </Button>
        </form>
      </Form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        Vous n&apos;avez pas de compte ?{" "}
        <Button variant="link" className="px-0" onClick={toggleForm}>
          Inscrivez-vous dès maintenant !
        </Button>
      </div>
    </>
  );
}
