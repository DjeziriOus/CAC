"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SkeletonUser from "@/components/ui/SkeletonUser";

// Import the two forms
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { toast } from "@/hooks/use-toast";

/**
 * AuthDialog manages:
 * - The dialog open/close
 * - Toggling between Login & Signup with a height transition
 * - Handling "failed to fetch" case
 */
export default function AuthDialog({ children, to = "#" }) {
  const { error, status } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // For smooth container height transitions
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("auto");

  /**
   * If user closes the dialog, reset to login form
   */
  const handleOpenChange = useCallback((value) => {
    setOpen(value);
    if (!value) {
      setIsLogin(true);
    }
  }, []);

  /**
   * Toggle form (login <-> signup) with a measured height
   */
  const toggleForm = useCallback(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
    requestAnimationFrame(() => {
      setIsLogin((prev) => !prev);
    });
  }, []);

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

  /**
   * If "Failed to fetch," replicate your snippet’s server-error pattern
   */
  if (error === "Failed to fetch") {
    toast({
      title: "(500) Serveur est en panne. Veuillez essayer plus tard.",
      variant: "destructive",
    });
    return <SkeletonUser />;
    // return <Toaster />;
    // return (
    //   <>
    //     {/* */}
    //     <AlertElement errorMessage="(500) Serveur est en panne. Veuillez essayer plus tard." />
    //   </>
    // );
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {/* Animate container height from old->new */}
        <motion.div
          style={{ overflow: "hidden" }}
          animate={{ height: containerHeight }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          <div ref={containerRef}>
            {/* Fade whichever form is active */}
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ padding: "0 5px" }}
            >
              {isLogin ? (
                <LoginForm
                  to={to}
                  error={error}
                  status={status}
                  toggleForm={toggleForm}
                />
              ) : (
                <SignupForm
                  to={to}
                  error={error}
                  status={status}
                  toggleForm={toggleForm}
                />
              )}
            </motion.div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
