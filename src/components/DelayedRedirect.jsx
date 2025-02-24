import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DelayedRedirect = ({ destination, time = 5 }) => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(time); // Start from 5 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate(`${destination}`, { replace: true }); // Change to your target route
    }, time * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, destination, time]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="pb-10 text-4xl font-bold text-red-500">Accés Refusé</h1>
      <p className="text-lg font-semibold">
        Redirection dans {countdown} secondes...
      </p>
    </div>
  );
};

export default DelayedRedirect;
