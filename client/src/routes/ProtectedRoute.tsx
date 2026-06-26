import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

const ProtectedRoute = ({
  children,
  allowedRoles,
}: Props) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;