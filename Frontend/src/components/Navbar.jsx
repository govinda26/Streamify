import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="h-6 w-6 rounded bg-red-600" />
          <span className="text-lg font-semibold">Streamify</span>
        </Link>
        <div className="mx-auto w-full max-w-xl">
          <div className="flex items-center rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2">
            <input
              className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-500"
              placeholder="Search"
              aria-label="Search"
            />
          </div>
        </div>
        <Link to="/login" className="rounded-md bg-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-700">
          Login
        </Link>
      </div>
    </header>
  );
}

export default Navbar;











