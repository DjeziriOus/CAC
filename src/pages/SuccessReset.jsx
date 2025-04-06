"use client";

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const SuccessReset = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <PageTransition>
      <div className="auth-form-container">
        <div className="auth-form text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2,
            }}
            className="success-icon"
          >
            ✓
          </motion.div>

          <motion.h1
            className="auth-title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Mot de passe réinitialisé !
          </motion.h1>

          <motion.p
            className="auth-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez
            maintenant vous connecter avec votre nouveau mot de passe.
          </motion.p>

          <motion.button
            className="btn btn-primary"
            onClick={handleGoToLogin}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Retour à la connexion
          </motion.button>
        </div>
      </div>
      <div className="auth-image"></div>
    </PageTransition>
  );
};

export default SuccessReset;
