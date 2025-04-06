"use client";

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call to send reset code
    setTimeout(() => {
      setIsLoading(false);
      navigate("/verify-code", { state: { email } });
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="auth-form-container">
        <div className="auth-form">
          <motion.h1
            className="auth-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Mot de passe oublié ?
          </motion.h1>
          <motion.p
            className="auth-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Entrez votre adresse e-mail et nous vous enverrons un code pour
            réinitialiser votre mot de passe.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="Saisissez votre adresse e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Envoi en cours..." : "Envoyer le code"}
            </button>

            <div className="mt-4 text-center">
              <Link to="/" className="link">
                Retour à la connexion
              </Link>
            </div>
          </motion.form>
        </div>
      </div>
      <div className="auth-image"></div>
    </PageTransition>
  );
};

export default ForgotPassword;
