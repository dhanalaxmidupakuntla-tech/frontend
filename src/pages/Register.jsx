import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate("/login");
    alert("Registered! Now Login 🎉");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-blue-300">
      <form onSubmit={submit} className="bg-white p-8 rounded-xl w-80">
        <h2 className="text-2xl font-bold mb-4">Register 🚀</h2>

        <input
          className="w-full border p-2 mb-3"
          placeholder="Email"
          onChange={(e) => setForm({...form, email:e.target.value})}
        />
        <input
          type="password"
          className="w-full border p-2 mb-3"
          placeholder="Password"
          onChange={(e) => setForm({...form, password:e.target.value})}
        />

        <button className="w-full bg-blue-600 text-white py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}