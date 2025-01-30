import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginUser } from "@/sections/user/userSlice";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  password: z.string().min(6, {
    message: "Le mot de passe doit contenir au moins 6 caractères.",
  }),
  rememberMe: z.boolean().default(false),
});

export function LoginDialog() {
  const [open, setOpen] = useState(false);
  // const [serverError, setServerError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Redux
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Grab auth state from Redux
  const { error, status, user } = useSelector((state) => state.user);
  // console.log({ error, status, user });
  // If login successful, close dialog

  useEffect(() => {
    if (status === "succeeded" && user) {
      console.log("relly?");
      setOpen(false);
      form.reset();
    }
  }, [status, user, form]);

  async function onSubmit(values) {
    try {
      await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
          // values,
        }),
      ).unwrap();
    } catch (error) {
      // Error is already handled by Redux
      console.log(error);
    }
  }

  return (
    <Dialog>
      {error == "Failed to fetch" ? (
        <span className="flex items-center font-extrabold text-red-500">
          SERVER IS DOWN !
        </span>
      ) : (
        <DialogTrigger asChild>
          <Button variant="outline">Connectez-vous</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Login</DialogTitle>
        </DialogHeader>
        <div className="mb-4 text-muted-foreground">
          Connectez-vous pour plus d&apos;options et poser vos questions en Q&A.
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Saisissez votre email..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Saisissez votre mot de passe..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {error && (
              <div className="text-sm font-medium text-destructive">
                {error}
              </div>
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
          <Button variant="link" className="px-0">
            Inscrivez-vous dès maintenant !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
