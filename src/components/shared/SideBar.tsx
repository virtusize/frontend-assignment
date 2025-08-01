import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const { pathname } = useLocation();

  const linkClasses = (path: string) =>
    `block px-4 py-2 rounded hover:bg-gray-200 ${
      pathname === path ? "bg-gray-300 font-semibold" : ""
    }`;

  return (
    <nav className="p-4 space-y-1">
      <Link to="/dashboard" className={linkClasses("/dashboard")}>
        Dashboard
      </Link>
    </nav>
  );
};

export default Sidebar;
