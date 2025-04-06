"use client";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import PasswordInput from "@/features/user/PasswordInput";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { email, code } = location.state || {};

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call to reset password
    setTimeout(() => {
      setIsLoading(false);
      navigate("/success");
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
            Créer un nouveau mot de passe
          </motion.h1>
          <motion.p
            className="auth-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Votre nouveau mot de passe doit être différent des mots de passe
            précédemment utilisés.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {error && (
              <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="password">
                Nouveau mot de passe
              </label>
              <div className="password-input-container">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Saisissez votre nouveau mot de passe..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmer le mot de passe
              </label>
              <div className="password-input-container">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Confirmez votre nouveau mot de passe..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              <PasswordInput field= showPassword={showPassword} />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading
                ? "Réinitialisation..."
                : "Réinitialiser le mot de passe"}
            </button>
          </motion.form>
        </div>
      </div>
      <div className="auth-image"></div>
    </PageTransition>
  );
};

export default ResetPassword;
