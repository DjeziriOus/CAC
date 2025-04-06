"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// shadcn radio group
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

import { useSignup } from "./useSignup";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

/**
 * Zod schema for the signup form:
 * - Includes nom, prenom, role, password, confirmPassword
 * - Check password == confirmPassword at the object level
 */
const signupSchema = z
  .object({
    email: z
      .string()
      .email({ message: "Veuillez entrer une adresse email valide." }),
    nom: z.string().min(1, { message: "Veuillez saisir votre nom." }),
    prenom: z.string().min(1, { message: "Veuillez saisir votre prénom." }),
    password: z
      .string()
      .min(3, "Le mot de passe doit contenir au moins 3 caractères."),
    confirmPassword: z
      .string()
      .min(3, "Le mot de passe doit contenir au moins 3 caractères."),
    // role radio group
    role: z.enum(["patient", "etudiant"], {
      errorMap: () => ({ message: "Veuillez sélectionner un rôle." }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"],
  });

/**
 * A reusable SignupForm that:
 * - uses react-hook-form + zod
 * - dispatches Redux signup on submit
 * - has show/hide for password & confirmPassword
 * - includes nom, prenom, role (radio group)
 */
export default function SignupForm({ toggleForm }) {
  // const { user, isPending, error } = useUser();
  // Show/hide states for password + confirmPassword
  const [showPassword, setShowPassword] = useState(false);
  const { signup, error, isSigningUp } = useSignup();
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      nom: "",
      prenom: "",
      password: "",
      confirmPassword: "",
      role: "patient", // default selection
    },
  });
  function onSubmit(values) {
    signup({
      email: values.email,
      nom: values.nom,
      prenom: values.prenom,
      password: values.password,
      role: values.role,
    });
    navigate("/");
  }

  // Toggling each field
  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <>
      <DialogTitle>
        <div className="mb-2 text-2xl font-bold">Signup</div>
      </DialogTitle>
      <div className="mb-4 text-muted-foreground">
        Créez un compte pour accéder à plus de fonctionnalités.
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
                    placeholder="Saisissez votre email..."
                    field={field}
                    error={error || form.formState.errors?.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom */}
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : "text-primary"}>
                  Nom
                </FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Saisissez votre nom..."
                    field={field}
                    error={error || form.formState.errors?.nom}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Prénom */}
          <FormField
            control={form.control}
            name="prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : "text-primary"}>
                  Prénom
                </FormLabel>
                <FormControl>
                  <FormInput
                    placeholder="Saisissez votre prénom..."
                    field={field}
                    error={error || form.formState.errors?.prenom}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password + show/hide */}
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
                    error={error || form.formState.errors?.password}
                    handleTogglePassword={handleTogglePassword}
                    showPassword={showPassword}
                    placeholder="Saisissez votre mot de passe..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password + show/hide */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : "text-primary"}>
                  Confirmez le mot de passe
                </FormLabel>
                <FormControl>
                  <PasswordInput
                    field={field}
                    error={error || form.formState.errors?.confirmPassword}
                    handleTogglePassword={handleTogglePassword}
                    showPassword={showPassword}
                    placeholder="Confirmez votre mot de passe..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role (shadcn radio group) */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <RadioGroup
                    // watch/setValue approach
                    value={field.value}
                    onValueChange={field.onChange}
                    className="space-y-2"
                    defaultValue="patient"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="patient"
                        // className="border-[#16A7B7] text-[#16A7B7]"
                        id="patient"
                      />
                      <Label htmlFor="patient" className="text-blue-2">
                        Patient
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="etudiant"
                        id="etudiant"
                        // className="border-[#16A7B7] text-[#16A7B7]"
                      />
                      <Label htmlFor="etudiant" className="text-blue-2">
                        Étudiant
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Echec de l&#39;inscription</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            onClick={() => {
              console.log(form.formState);
            }}
            className="w-full bg-blue-2"
            disabled={isSigningUp || form.formState.isSubmitting}
          >
            {isSigningUp || form.formState.isSubmitting
              ? "Création du compte..."
              : "Créer un compte"}
          </Button>
        </form>
      </Form>
      <div className="mt-0 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Button
          variant="link"
          className="px-0 text-blue-2"
          onClick={toggleForm}
          disabled={isSigningUp}
        >
          Se Connecter
        </Button>
      </div>
    </>
  );
}
