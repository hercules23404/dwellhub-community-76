
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    // Simulate a successful signup
    // In real flow, you would make an API call here
    navigate("/admin/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-2xl font-bold mb-4">Admin Signup</h1>
      <form className="flex flex-col gap-4 w-96" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Full Name"
          className="px-4 py-2 border rounded"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
