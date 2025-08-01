import Button from "../shared/Button";
import { LoginForm, RegisterForm, ForgotPasswordForm } from "./forms";
import { useNavigate } from "react-router-dom";
import { AuthCardProps, AuthMode } from "./types";

const AuthCard = ({ mode, setMode }: AuthCardProps) => {
  const navigate = useNavigate();

  const switchTo = (target: AuthMode) => () => setMode(target);

  const renderForm = () => {
    switch (mode) {
      case "login":
        return <LoginForm onSuccess={() => navigate("/dashboard")} />;
      case "register":
        return <RegisterForm onSuccess={() => setMode("login")} />;
      case "forgot":
        return <ForgotPasswordForm onSuccess={() => setMode("login")} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-xl p-8 z-10 min-h-[400px] flex flex-col justify-center">
      <h2 className="text-2xl font-bold text-center mb-6">Virtusize</h2>
      {renderForm()}

      <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
        {mode === "login" ? (
          <div className="flex justify-between">
            <Button type="button" variant="ghost" onClick={switchTo("forgot")}>
              Forgot Password?
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={switchTo("register")}
            >
              Register
            </Button>
          </div>
        ) : (
          <Button type="button" variant="ghost" onClick={switchTo("login")}>
            Back to Login
          </Button>
        )}
      </div>
    </div>
  );
};

export default AuthCard;
