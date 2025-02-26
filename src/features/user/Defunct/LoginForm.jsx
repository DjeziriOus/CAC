import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { useForm } from "react-hook-form";

import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Veuillez saisir un email valide."),
  password: z.string().min(1, "Veuillez saisir votre mot de passe."),
});

/* ---------------------------------------------------------------------------
   2) LoginForm Component
      - Uses react-hook-form with loginSchema
--------------------------------------------------------------------------- */
export default function LoginForm({
  onToggleForm,
  onTogglePasswords,
  showPasswords,
  closeDialog,
}) {
  // React Hook Form setup
  const form = useForm({
    resolver: zodResolver(loginSchema),
  });
  const { error, status, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  // Called when user submits the form
  async function onSubmit(values) {
    // // data has { email, password }
    // console.log("Login data:", data);
    // // If successful, close the dialog or do your real login logic
    // alert("Login successful!");
    // closeDialog();
    try {
      dispatch(loginUser(values));
    } catch (error) {
      // Error is already handled by Redux
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormItem>
                <FormLabel
                  htmlFor="email"
                  className={error ? "text-red-500" : ""}
                >
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Saisissez votre email..."
                    {...field}
                    className={error ? "border-destructive" : ""}
                  />
                </FormControl>
              </FormItem>
            </FormItem>
          )}
        />
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="Saisissez votre email"
          // register provides onChange, value, etc.
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email.message}</p>
        )}

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="login-password">Mot de passe</Label>
          <div className="relative">
            <Input
              id="login-password"
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

        {/* Submit */}
        <Button
          type="submit"
          className="w-full bg-[#00A3B5] hover:bg-[#00919F]"
        >
          Login
        </Button>

        {/* Switch to Signup */}
        <div className="text-center">
          <span className="text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{" "}
          </span>
          <Button
            variant="link"
            type="button"
            className="text-[#00A3B5]"
            onClick={onToggleForm}
          >
            Inscrivez-vous
          </Button>
        </div>
      </form>
    </Form>
  );
}
