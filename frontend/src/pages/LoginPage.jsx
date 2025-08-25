import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-black mb-6">Login</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black bg-gray-50" required />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <div className="mt-4 text-gray-600 text-sm">
          Don&apos;t have an account? <Link to="/register" className="text-black underline">Register</Link>
        </div>
      </div>
    </div>
  );
} 