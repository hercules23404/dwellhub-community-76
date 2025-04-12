
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getUtilityWorkers, addUtilityWorker } from "@/lib/api/maintenance";
import { UtilityWorker } from "@/types/maintenance";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

// Update the worker schema to make name and specialty required
const workerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  specialty: z.string().min(2, "Specialty is required"),
  phone_number: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
});

type WorkerFormValues = z.infer<typeof workerSchema>;

interface WorkerManagementProps {
  societyId: string;
}

export function WorkerManagement({ societyId }: WorkerManagementProps) {
  const [workers, setWorkers] = useState<UtilityWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingWorker, setIsAddingWorker] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const form = useForm<WorkerFormValues>({
    resolver: zodResolver(workerSchema),
    defaultValues: {
      name: "",
      specialty: "",
      phone_number: "",
      email: "",
    },
  });

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const data = await getUtilityWorkers(societyId);
      setWorkers(data);
    } catch (error) {
      console.error("Error fetching workers:", error);
      toast.error("Failed to load utility workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (societyId) {
      fetchWorkers();
    }
  }, [societyId]);

  const onSubmit = async (data: WorkerFormValues) => {
    setIsAddingWorker(true);
    try {
      // Fix: Make sure name and specialty are always provided, as required by the UtilityWorker type
      await addUtilityWorker({
        society_id: societyId,
        name: data.name,           // Now this is guaranteed to be a string
        specialty: data.specialty, // Now this is guaranteed to be a string
        phone_number: data.phone_number || null,
        email: data.email || null,
      });
      
      form.reset();
      fetchWorkers();
      setSheetOpen(false);
      toast.success("Utility worker added successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to add worker");
    } finally {
      setIsAddingWorker(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Utility Workers</CardTitle>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Worker
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Worker</SheetTitle>
              <SheetDescription>
                Add a new utility worker for maintenance requests
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Worker name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="specialty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specialty</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Plumbing, Electrical" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <SheetFooter className="pt-4">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isAddingWorker}
                    >
                      {isAddingWorker ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Worker"
                      )}
                    </Button>
                  </SheetFooter>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">
            No workers added yet. Add utility workers to assign to maintenance requests.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Specialty</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell className="font-medium">{worker.name}</TableCell>
                  <TableCell>{worker.specialty}</TableCell>
                  <TableCell>{worker.phone_number || "-"}</TableCell>
                  <TableCell>{worker.email || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
