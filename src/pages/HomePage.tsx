import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BackgroundImage from "../components/shared/BackgroundImage";
import bgImage from "../assets/homeBg.webp";
import AuthCard from "../components/auth/AuthCard";
import { useAuthStore } from "../stores/useAuthStore";
import type { AuthMode } from "../components/auth/types";

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const modeParam = searchParams.get("mode");
  const mode: AuthMode = ["login", "register", "forgot"].includes(modeParam!)
    ? (modeParam as AuthMode)
    : "login";

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  const setMode = (newMode: AuthMode) => {
    setSearchParams({ mode: newMode });
  };

  return (
    <BackgroundImage
      src={bgImage}
      alt="Login background"
      overlayClassName="min-h-screen w-full flex items-center justify-center px-4 relative"
    >
      <AuthCard mode={mode} setMode={setMode} />
    </BackgroundImage>
  );
};

export default HomePage;
