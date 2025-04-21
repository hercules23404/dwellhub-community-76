
import { useState } from "react";
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";
import { useNavigate } from "react-router-dom";

export default function TenantLoginPage() {
  const { login } = useWireframeAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Could validate credentials here (mock only)
    login("tenant", email);
    navigate("/tenant/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Tenant Login</h1>
      <form className="flex flex-col gap-4 w-80" onSubmit={handleLogin}>
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
          autoComplete="current-password"
        />
        <button 
          type="submit"
          className="px-6 py-2 bg-primary text-white rounded"
        >Login as Tenant</button>
      </form>
    </div>
  );
}
