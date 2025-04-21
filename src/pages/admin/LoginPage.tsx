
import { useWireframeAuth } from "@/contexts/WireframeAuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const { login } = useWireframeAuth();
  const navigate = useNavigate();
  const handleLogin = () => {
    login("admin");
    navigate("/admin/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <button 
        className="px-6 py-2 bg-red-600 text-white rounded" 
        onClick={handleLogin}
      >Login as Admin</button>
    </div>
  );
}
