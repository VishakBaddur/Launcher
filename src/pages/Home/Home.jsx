import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Validate & Grow Your Startup Idea</h1>
        <p className="text-xl text-gray-600">
          Get instant validation and generate a professional business plan
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <Link 
          to="/validate" 
          className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-3">Validate Idea</h2>
          <p className="text-gray-600">
            Get market validation for your startup concept with our AI-powered analysis.
          </p>
        </Link>
        
        <Link 
          to="/generate" 
          className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-bold text-blue-600 mb-3">Generate Plan</h2>
          <p className="text-gray-600">
            Create a comprehensive business plan tailored to your startup.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Home;