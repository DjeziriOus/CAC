import { useUser } from "@/features/user/useUser";
import { Navigate } from "react-router-dom";

function VerifyLogin({ children }) {
  const { user, isSuccess } = useUser();
  if (!user && isSuccess) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
}

export default VerifyLogin;
