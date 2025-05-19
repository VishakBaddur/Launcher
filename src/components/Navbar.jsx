import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-blue-600">Startup Helper</Link>
        <div className="flex space-x-4">
          <Link 
            to="/validate" 
            className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition"
          >
            Validate Idea
          </Link>
          <Link 
            to="/generate" 
            className="px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-700 transition"
          >
            Generate Plan
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;