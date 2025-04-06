"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const VerifyCode = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  useEffect(() => {
    // Focus the first input on component mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6) return;

    setIsLoading(true);

    // Simulate API call to verify code
    setTimeout(() => {
      setIsLoading(false);
      navigate("/reset-password", { state: { email, code: fullCode } });
    }, 1500);
  };

  const handleResendCode = () => {
    // Simulate resending code
    alert("Un nouveau code a été envoyé à " + email);
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
            Vérification du code
          </motion.h1>
          <motion.p
            className="auth-subtitle"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Nous avons envoyé un code à <strong>{email}</strong>. Veuillez
            saisir ce code ci-dessous.
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="code-input-container">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  className="code-input"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || code.some((digit) => !digit)}
            >
              {isLoading ? "Vérification..." : "Vérifier le code"}
            </button>

            <div className="mt-4 text-center">
              <button type="button" className="link" onClick={handleResendCode}>
                Renvoyer le code
              </button>
            </div>
          </motion.form>
        </div>
      </div>
      <div className="auth-image"></div>
    </PageTransition>
  );
};

export default VerifyCode;
