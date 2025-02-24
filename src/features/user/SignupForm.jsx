"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { signupUser } from "@/features/user/userSlice";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

// shadcn radio group
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

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
      .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
    confirmPassword: z
      .string()
      .min(6, "Le mot de passe doit contenir au moins 6 caractères."),
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
export default function SignupForm({ toggleForm, to = "#" }) {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.user);
  // Show/hide states for password + confirmPassword
  const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  async function onSubmit(values) {
    try {
      // Dispatch your Redux action
      await dispatch(
        signupUser({
          email: values.email,
          nom: values.nom,
          prenom: values.prenom,
          password: values.password,
          role: values.role,
        }),
      ).unwrap();
      console.log(to);
      navigate(to);
    } catch (err) {
      console.error(err);
    }
  }

  // Toggling each field
  const handleTogglePassword = () => setShowPassword((prev) => !prev);
  // const handleToggleConfirmPassword = () =>
  //   setShowConfirmPassword((prev) => !prev);

  return (
    <>
      {" "}
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

          {/* Nom */}
          <FormField
            control={form.control}
            name="nom"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={error ? "text-red-500" : ""}>
                  Nom
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisissez votre nom..."
                    {...field}
                    className={error ? "border-destructive" : ""}
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
                <FormLabel className={error ? "text-red-500" : ""}>
                  Prénom
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisissez votre prénom..."
                    {...field}
                    className={error ? "border-destructive" : ""}
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
                <FormLabel className={error ? "text-red-500" : ""}>
                  Mot de passe
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Saisissez votre mot de passe..."
                      className={error ? "border-destructive" : ""}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-2"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
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
                <FormLabel className={error ? "text-red-500" : ""}>
                  Confirmez le mot de passe
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirmez votre mot de passe..."
                      className={
                        (error ? "border-destructive" : "") + "h-auto p-3"
                      }
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-4 text-primary"
                      onClick={handleTogglePassword}
                    >
                      {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                    </Button>
                  </div>
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

          {/* Global Redux error */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-blue-2"
            disabled={status === "loading" || form.formState.isSubmitting}
          >
            {status === "loading" || form.formState.isSubmitting
              ? "Création du compte..."
              : "Créer un compte"}
          </Button>
        </form>
      </Form>
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Vous avez déjà un compte ?{" "}
        <Button
          variant="link"
          className="px-0 text-blue-2"
          onClick={toggleForm}
        >
          Connectez-vous
        </Button>
      </div>
    </>
  );
}
