import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex space-x-6">
        <Link to="/" className="text-white font-medium hover:text-yellow-400">
          Home
        </Link>
        <Link to="/menu" className="text-white font-medium hover:text-yellow-400">
          Menu
        </Link>
      </div>
    </nav>
  );
}
