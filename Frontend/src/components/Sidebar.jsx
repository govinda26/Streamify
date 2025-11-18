import { NavLink } from "react-router-dom";

const navItemClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm ${isActive ? "bg-neutral-800 text-white" : "text-neutral-300 hover:bg-neutral-800/60"}`;

function Sidebar() {
  return (
    <aside className="sticky top-14 h-[calc(100vh-56px)] w-60 shrink-0 border-r border-neutral-800 bg-neutral-950 p-3">
      <nav className="space-y-1">
        <NavLink to="/" className={navItemClass} end>
          Home
        </NavLink>
        <NavLink to="/subscriptions" className={navItemClass}>
          Subscriptions
        </NavLink>
        <NavLink to="/library" className={navItemClass}>
          Library
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;











