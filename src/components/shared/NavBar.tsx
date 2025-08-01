import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import Button from "./Button";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const handleLogout = () => {
    logout();
    navigate("/?mode=login", { replace: true });
  };

  return (
    <header className="bg-amber-200 shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold">{`Welcome ${user?.username}`}</h1>
      <Button
        data-cy="logout-btn"
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </Button>
    </header>
  );
};

export default Navbar;
