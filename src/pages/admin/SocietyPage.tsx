
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminSocietyPage() {
  // DEV: Page accessible for all
  const [hasSociety, setHasSociety] = useState(false);
  const [societyName, setSocietyName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const managedSocietyName = "Malabar Heights";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!societyName || !address || !description) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setHasSociety(true);
      setIsSubmitting(false);
      navigate("/admin/dashboard", { state: { societyName: societyName } });
    }, 900);
  };

  if (!hasSociety) {
    return (
      <div className="max-w-lg mx-auto mt-16 p-8 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Create Your Society</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">
              Society Name
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={societyName}
              onChange={(e) => setSocietyName(e.target.value)}
              required
              placeholder="e.g. Malabar Heights"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Address
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              placeholder="123 Society Street, City"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Short description of your society"
              disabled={isSubmitting}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded mt-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Society"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-32 bg-white rounded-lg shadow p-8 text-center">
      <h1 className="text-2xl font-bold mb-4">{`You are managing ${managedSocietyName}`}</h1>
      <p className="text-gray-700">
        Welcome, Society Admin! Here you can manage all aspects of your society.
      </p>
    </div>
  );
}
