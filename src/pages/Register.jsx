import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/login");
      alert("Registered! Now login 🎉");
    } catch (err) {
      console.error(err);
      setError(!err.response ? "Network error" : "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-300 dark:bg-gray-900">
      <form onSubmit={submit} className="bg-white dark:bg-gray-800 p-8 rounded-xl w-80">
        <h2 className="text-2xl font-bold mb-4">Register 🚀</h2>

        <input
          className="w-full border p-2 mb-3"
          type="email"
          autoComplete="email"
          placeholder="Email"
          onChange={(e) => setForm({...form, email:e.target.value})}
        />
        <input
          type="password"
          autoComplete="new-password"
          className="w-full border p-2 mb-3"
          placeholder="Password"
          onChange={(e) => setForm({...form, password:e.target.value})}
        />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}