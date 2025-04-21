
import { useState } from "react";
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminSignupPage() {
  const { login } = useWireframeAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [societyName, setSocietyName] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock account creation
    login("admin", email);
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
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
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <input
          type="text"
          placeholder="Society Name"
          className="px-4 py-2 border rounded"
          value={societyName}
          onChange={(e) => setSocietyName(e.target.value)}
          required
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded"
        >
          Create Admin Account
        </button>
      </form>
    </div>
  );
}
