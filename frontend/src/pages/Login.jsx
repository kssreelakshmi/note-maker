import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      login(res.data); // store token + user
      navigate("/dashboard"); // 🔥 redirect

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="p-6 shadow-lg rounded w-80">
        <h2 className="text-xl mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-3 w-full"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-4 py-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}