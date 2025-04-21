
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TenantLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      // Simulate login success
      setIsSubmitting(false);
      navigate("/tenant/dashboard");
    }, 800);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-200 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6 animate-fade-in"
      >
        <h1 className="text-3xl font-bold text-purple-700 mb-4 text-center">Tenant Login</h1>
        <div>
          <label htmlFor="email" className="block font-medium mb-1">Email</label>
          <input
            className="w-full border rounded px-3 py-2 text-base focus:ring-2 focus:ring-purple-400"
            id="email"
            type="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium mb-1">Password</label>
          <input
            className="w-full border rounded px-3 py-2 text-base focus:ring-2 focus:ring-purple-400"
            id="password"
            type="password"
            autoComplete="current-password"
            required
            disabled={isSubmitting}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="********"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded py-2 font-semibold transition hover:from-purple-700 hover:to-indigo-700 disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
