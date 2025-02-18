"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Redux action
import { loginUser } from "@/features/user/userSlice";

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

/**
 * Zod schema for the login form
 */
const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
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
export default function LoginForm({ error, status, toggleForm }) {
  const dispatch = useDispatch();

  // Show/hide password local state
  const [showPassword, setShowPassword] = useState(false);

  // RHF
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (values) => {
    try {
      dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        }),
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Toggles password field type
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <div className="mb-2 text-2xl font-bold">Login</div>
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
                <FormLabel className={error ? "text-red-500" : ""}>
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisissez votre email..."
                    {...field}
                    className={error ? "border-destructive" : ""}
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
                <FormLabel className={error ? "text-red-500" : ""}>
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Saisissez votre mot de passe..."
                      className={
                        error
                          ? "border-destructive"
                          : "bg-blue-input-bg h-auto py-3 text-blue-2 placeholder:text-blue-2"
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
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "loading" || form.formState.isSubmitting}
          >
            {status === "loading" || form.formState.isSubmitting
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
