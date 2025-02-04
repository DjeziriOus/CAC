"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// 1) Import zod
import { z } from "zod";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

/* ---------------------------------------------------------------------------
   Zod Schemas for form validation
--------------------------------------------------------------------------- */
const loginSchema = z.object({
  email: z.string().email("Veuillez saisir un email valide."),
  password: z.string().min(1, "Veuillez saisir votre mot de passe."),
});

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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["confirmPassword"], // attach error to confirmPassword
  });

/* ---------------------------------------------------------------------------
   Main AuthDialog Component
   - Smooth height transition
   - Fade-in for new form
   - Zod validation in handleLoginSubmit & handleSignupSubmit
   - Resets to login after dialog closes
   - Single toggle for password visibility
--------------------------------------------------------------------------- */
export default function AuthDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // States for login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // States for signup
  const [signupEmail, setSignupEmail] = useState("");
  const [signupNom, setSignupNom] = useState("");
  const [signupPrenom, setSignupPrenom] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupUserType, setSignupUserType] = useState("patient");
  const [signupError, setSignupError] = useState("");

  // Single toggle controlling password fields
  const [showPasswords, setShowPasswords] = useState(false);

  // For container height transitions
  const [containerHeight, setContainerHeight] = useState("auto");
  const containerRef = useRef(null);

  // Close => reset to login form & clear fields
  const handleOpenChange = useCallback((open) => {
    setIsOpen(open);
    if (!open) {
      setIsLogin(true);

      // Clear fields if desired
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      setSignupEmail("");
      setSignupNom("");
      setSignupPrenom("");
      setSignupPassword("");
      setSignupConfirmPassword("");
      setSignupUserType("patient");
      setSignupError("");
      setShowPasswords(false);
    }
  }, []);

  // Toggle forms with height measurement
  const handleToggleForm = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    requestAnimationFrame(() => {
      setIsLogin((prev) => !prev);
    });
  }, []);

  // Animate container from old -> new height
  useEffect(() => {
    if (containerHeight !== "auto") {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          const newHeight = containerRef.current.offsetHeight;
          setContainerHeight(newHeight);
          const timer = setTimeout(() => {
            setContainerHeight("auto");
          }, 300);
          return () => clearTimeout(timer);
        }
      });
    }
  }, [isLogin, containerHeight]);

  // Single toggler for password fields
  const handleTogglePasswords = useCallback(() => {
    setShowPasswords((prev) => !prev);
  }, []);

  /* ----------------------
     Handle Login w/ zod
  ---------------------- */
  const handleLoginSubmit = useCallback(() => {
    const result = loginSchema.safeParse({
      email: loginEmail,
      password: loginPassword,
    });
    if (!result.success) {
      setLoginError(result.error.issues[0].message);
      return;
    }
    setLoginError("");
    alert("Login successful!");
    // ...perform your real login logic
  }, [loginEmail, loginPassword]);

  /* -----------------------
     Handle Signup w/ zod
  ----------------------- */
  const handleSignupSubmit = useCallback(() => {
    const result = signupSchema.safeParse({
      email: signupEmail,
      nom: signupNom,
      prenom: signupPrenom,
      password: signupPassword,
      confirmPassword: signupConfirmPassword,
      userType: signupUserType,
    });
    if (!result.success) {
      setSignupError(result.error.issues[0].message);
      return;
    }
    setSignupError("");
    alert("Signup successful!");
    // ...perform your real signup logic
  }, [
    signupEmail,
    signupNom,
    signupPrenom,
    signupPassword,
    signupConfirmPassword,
    signupUserType,
  ]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Connectez-vous</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {/* Animate container's height with Framer Motion */}
        <motion.div
          style={{ overflow: "hidden" }}
          animate={{ height: containerHeight }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div ref={containerRef}>
            {/* Fade the new form in (immediate unmount of old form) */}
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {isLogin ? (
                <LoginForm
                  email={loginEmail}
                  password={loginPassword}
                  error={loginError}
                  showPasswords={showPasswords}
                  onTogglePasswords={handleTogglePasswords}
                  onEmailChange={setLoginEmail}
                  onPasswordChange={setLoginPassword}
                  onSubmit={handleLoginSubmit}
                  onToggleForm={handleToggleForm}
                />
              ) : (
                <SignupForm
                  email={signupEmail}
                  nom={signupNom}
                  prenom={signupPrenom}
                  password={signupPassword}
                  confirmPassword={signupConfirmPassword}
                  userType={signupUserType}
                  error={signupError}
                  showPasswords={showPasswords}
                  setEmail={setSignupEmail}
                  setNom={setSignupNom}
                  setPrenom={setSignupPrenom}
                  setPassword={setSignupPassword}
                  setConfirmPassword={setSignupConfirmPassword}
                  setUserType={setSignupUserType}
                  onTogglePasswords={handleTogglePasswords}
                  onSubmit={handleSignupSubmit}
                  onToggleForm={handleToggleForm}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
