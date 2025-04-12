
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Check, Loader2, Building, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export interface SocietyFormData {
  name: string;
  address: string;
  amenities: string[];
  utilityWorkers: {
    name: string;
    contact?: string;
  }[];
  numFlats: number;
}

interface SocietySetupFormProps {
  onSubmit: (formData: SocietyFormData) => void;
  isLoading?: boolean;
  initialData?: Partial<SocietyFormData>;
  submitButtonText?: string;
}

export function SocietySetupForm({ 
  onSubmit, 
  isLoading = false, 
  initialData, 
  submitButtonText = "Create Society"
}: SocietySetupFormProps) {
  const [formData, setFormData] = useState<SocietyFormData>({
    name: initialData?.name || "",
    address: initialData?.address || "",
    amenities: initialData?.amenities || [],
    utilityWorkers: initialData?.utilityWorkers || [],
    numFlats: initialData?.numFlats || 0
  });
  
  // For adding new amenities and workers
  const [newAmenity, setNewAmenity] = useState("");
  const [newWorkerName, setNewWorkerName] = useState("");
  const [newWorkerContact, setNewWorkerContact] = useState("");

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: name === "numFlats" ? parseInt(value) || 0 : value
    });
  };

  const addAmenity = () => {
    if (!newAmenity.trim()) return;
    
    setFormData({
      ...formData,
      amenities: [...formData.amenities, newAmenity.trim()]
    });
    setNewAmenity("");
  };

  const removeAmenity = (index: number) => {
    const updatedAmenities = [...formData.amenities];
    updatedAmenities.splice(index, 1);
    
    setFormData({
      ...formData,
      amenities: updatedAmenities
    });
  };

  const addWorker = () => {
    if (!newWorkerName.trim()) return;
    
    setFormData({
      ...formData,
      utilityWorkers: [
        ...formData.utilityWorkers, 
        { 
          name: newWorkerName.trim(),
          contact: newWorkerContact.trim() || undefined
        }
      ]
    });
    setNewWorkerName("");
    setNewWorkerContact("");
  };

  const removeWorker = (index: number) => {
    const updatedWorkers = [...formData.utilityWorkers];
    updatedWorkers.splice(index, 1);
    
    setFormData({
      ...formData,
      utilityWorkers: updatedWorkers
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || formData.numFlats <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-primary">Admin</Badge>
            <CardTitle>Create Your Society</CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to set up your society in the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Society Name <span className="text-destructive">*</span></Label>
            <Input 
              id="name"
              name="name"
              placeholder="Enter society name"
              value={formData.name}
              onChange={handleTextChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
            <Textarea 
              id="address"
              name="address"
              placeholder="Enter full address"
              value={formData.address}
              onChange={handleTextChange}
              disabled={isLoading}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amenities">Amenities</Label>
            <div className="flex gap-2">
              <Input 
                id="newAmenity"
                placeholder="e.g. Swimming Pool"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addAmenity} 
                variant="outline"
                disabled={isLoading || !newAmenity.trim()}
              >
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            
            {formData.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.amenities.map((amenity, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {amenity}
                    <button 
                      type="button" 
                      onClick={() => removeAmenity(index)}
                      className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
                      disabled={isLoading}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="utilityWorkers">Utility Workers</Label>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-3 gap-2">
                <Input 
                  placeholder="Name"
                  value={newWorkerName}
                  onChange={(e) => setNewWorkerName(e.target.value)}
                  disabled={isLoading}
                  className="col-span-1"
                />
                <Input 
                  placeholder="Contact (optional)"
                  value={newWorkerContact}
                  onChange={(e) => setNewWorkerContact(e.target.value)}
                  disabled={isLoading}
                  className="col-span-1"
                />
                <Button 
                  type="button" 
                  onClick={addWorker} 
                  variant="outline"
                  disabled={isLoading || !newWorkerName.trim()}
                  className="col-span-1"
                >
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
            </div>
            
            {formData.utilityWorkers.length > 0 && (
              <div className="mt-2 border rounded-md divide-y">
                {formData.utilityWorkers.map((worker, index) => (
                  <div key={index} className="flex items-center justify-between p-2">
                    <div>
                      <div className="font-medium">{worker.name}</div>
                      {worker.contact && <div className="text-sm text-muted-foreground">{worker.contact}</div>}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeWorker(index)}
                      className="text-destructive hover:text-destructive/80"
                      disabled={isLoading}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="numFlats">Number of Flats <span className="text-destructive">*</span></Label>
            <Input 
              id="numFlats"
              name="numFlats"
              type="number"
              min="1"
              placeholder="Enter number of flats"
              value={formData.numFlats || ""}
              onChange={handleTextChange}
              disabled={isLoading}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating society...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                {submitButtonText}
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
