import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto flex max-w-7xl gap-6 px-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="flex-1 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;











