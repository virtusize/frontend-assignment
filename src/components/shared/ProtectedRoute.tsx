import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { ReactNode } from "react";
import Navbar from "./NavBar";
import Sidebar from "./SideBar";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/?mode=login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <aside className="w-64 bg-white border-r hidden md:block">
          <Sidebar />
        </aside>

        <main className="flex-1 p-4 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
