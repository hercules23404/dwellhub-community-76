
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";
import { useNavigate } from "react-router-dom";

export default function TenantLoginPage() {
  const { login } = useWireframeAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    login("tenant");
    navigate("/tenant/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Tenant Login</h1>
      <button 
        className="px-6 py-2 bg-primary text-white rounded" 
        onClick={handleLogin}
      >Login as Tenant</button>
    </div>
  );
}
