
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

// Simple type for local property listing
type Property = {
  name: string;
  flat: string;
  type: "1BHK" | "2BHK" | "3BHK";
  rent: string;
  available: boolean;
};

export default function AdminPropertiesPage() {
  // Dummy starter listings
  const [properties, setProperties] = useState<Property[]>([
    { name: "Flat 204", flat: "204", type: "2BHK", rent: "15000", available: true },
    { name: "Flat 501", flat: "501", type: "3BHK", rent: "22000", available: false },
  ]);
  // Local state for form inputs
  const [form, setForm] = useState<Property>({
    name: "",
    flat: "",
    type: "2BHK",
    rent: "",
    available: true,
  });

  // REMOVED ANY LOGIN GUARD - page now always accessible

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type: inputType, checked } = e.target;
    setForm((f) => ({
      ...f,
      [id]: inputType === "checkbox" ? checked : value,
    }));
  };

  const handleSelect = (value: string) => {
    setForm((f) => ({ ...f, type: value as Property["type"] }));
  };

  const handleAvailability = (value: string) => {
    setForm((f) => ({ ...f, available: value === "yes" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!form.name || !form.flat || !form.rent) {
      toast.error("Please fill all required fields");
      return;
    }
    setProperties((prev) => [
      ...prev,
      {
        name: form.name,
        flat: form.flat,
        type: form.type,
        rent: form.rent,
        available: form.available,
      },
    ]);
    toast.success("Property listing created!");
    setForm({
      name: "",
      flat: "",
      type: "2BHK",
      rent: "",
      available: true,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 pt-20 pb-16 px-4 lg:pl-8 max-w-screen-2xl mx-auto">
          <div className="max-w-xl space-y-8 p-4">
            <h1 className="text-3xl font-bold mb-2">Property Listings</h1>
            {/* Create Listing Form */}
            <Card>
              <CardHeader>
                <CardTitle>Create New Property</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="name">Property Name</Label>
                    <Input id="name" placeholder="e.g. Flat 204" value={form.name} onChange={handleInput} />
                  </div>
                  <div>
                    <Label htmlFor="flat">Flat Number</Label>
                    <Input id="flat" placeholder="e.g. 204" value={form.flat} onChange={handleInput} />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select value={form.type} onValueChange={handleSelect}>
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1BHK">1BHK</SelectItem>
                        <SelectItem value="2BHK">2BHK</SelectItem>
                        <SelectItem value="3BHK">3BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="rent">Rent Amount</Label>
                    <Input id="rent" type="number" min="0" placeholder="e.g. 15000" value={form.rent} onChange={handleInput} />
                  </div>
                  <div>
                    <Label htmlFor="available">Availability</Label>
                    <Select value={form.available ? "yes" : "no"} onValueChange={handleAvailability}>
                      <SelectTrigger id="available">
                        <SelectValue placeholder="Select Availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Available</SelectItem>
                        <SelectItem value="no">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full mt-2" type="submit">
                    Create Listing
                  </Button>
                </form>
              </CardContent>
            </Card>
            {/* Listings */}
            <div className="mt-8 space-y-4">
              {properties.length === 0 && (
                <div className="text-muted-foreground text-center">No property listings found.</div>
              )}
              {properties.map((prop, i) => (
                <Card key={`${prop.flat}-${prop.type}-${i}`}>
                  <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <div>
                      <div className="font-bold text-lg">{prop.name}</div>
                      <div className="text-sm text-muted-foreground">Flat {prop.flat} | {prop.type}</div>
                    </div>
                    <div className="text-base font-medium">₹{Number(prop.rent).toLocaleString()}</div>
                    <div>
                      <span className={prop.available ? "text-green-600 font-semibold" : "text-gray-500 font-semibold"}>
                        {prop.available ? "Available" : "Rented"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
