// AuthProvider.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("jwt"));
    if (storedData) {
      // Check if token is expired
      if (Date.now() > storedData.exp) {
        localStorage.removeItem("jwt");
        // navigate("/"); // redirect if token expired
        window.location.reload();
      } else {
        // Calculate remaining time and set timeout
        const remainingTime = storedData.exp - Date.now();
        const timeoutId = setTimeout(() => {
          localStorage.removeItem("jwt");
          navigate("/"); // redirect after token expires
          window.location.reload();
        }, remainingTime);

        // Cleanup the timeout when component unmounts or dependency changes
        return () => clearTimeout(timeoutId);
      }
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AuthProvider;
