
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const serviceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string({ required_error: "Please select a category" }),
  priority: z.string({ required_error: "Please select a priority" }),
  propertyId: z.string({ required_error: "Please select a property" }),
  unitNumber: z.string().min(1, "Unit number is required"),
  scheduledDate: z.date().optional(),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

const categories = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance" },
  { value: "structural", label: "Structural" },
  { value: "landscaping", label: "Landscaping" },
  { value: "pest", label: "Pest Control" },
  { value: "cleaning", label: "Cleaning" },
  { value: "security", label: "Security" },
  { value: "other", label: "Other" },
];

export function ServiceRequestForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [properties, setProperties] = useState<{ value: string; label: string }[]>([
    { value: "prop1", label: "Sunset Apartments" },
    { value: "prop2", label: "Mountain View Condos" },
    { value: "prop3", label: "Garden Villas" },
  ]);
  
  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      unitNumber: "",
    },
  });

  useEffect(() => {
    // Fetch properties from Supabase
    const fetchProperties = async () => {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('id, name');
        
        if (error) throw error;
        
        if (data) {
          const formattedProperties = data.map(property => ({
            value: property.id,
            label: property.name,
          }));
          setProperties(formattedProperties);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    fetchProperties();
  }, []);

  const onSubmit = async (values: ServiceFormValues) => {
    if (!user) {
      toast.error("You must be logged in to submit a service request");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique service ID
      const serviceId = `SRV-${Date.now().toString().slice(-6)}`;
      
      const { error } = await supabase
        .from('services')
        .insert({
          service_id: serviceId,
          title: values.title,
          description: values.description,
          category: values.category,
          priority: values.priority,
          property_id: values.propertyId,
          unit_number: values.unitNumber,
          scheduled_date: values.scheduledDate?.toISOString(),
          status: "pending",
          user_id: user.id,
        });
      
      if (error) throw error;
      
      toast.success("Service request submitted successfully", {
        description: "We'll get back to you shortly",
      });
      
      form.reset();
    } catch (error: any) {
      console.error('Error submitting service request:', error);
      toast.error("Failed to submit service request", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Submit a Service Request</CardTitle>
        <CardDescription>
          Fill out the form below to request maintenance or other services for your property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Bathroom leak, broken window" {...field} />
                    </FormControl>
                    <FormDescription>
                      Briefly describe the issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the category that best describes your issue
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please provide as much detail as possible about the issue..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include relevant details such as when you noticed the issue, its severity, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="propertyId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Property</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? properties.find((property) => property.value === field.value)?.label
                              : "Select property"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder="Search property..." />
                          <CommandEmpty>No property found.</CommandEmpty>
                          <CommandGroup>
                            {properties.map((property) => (
                              <CommandItem
                                value={property.label}
                                key={property.value}
                                onSelect={() => {
                                  form.setValue("propertyId", property.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    property.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {property.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the property where the issue is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit/Apartment Number</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g., Apt 101, Unit B" {...field} />
                    </FormControl>
                    <FormDescription>
                      Specify your unit number
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low - Not Urgent</SelectItem>
                        <SelectItem value="medium">Medium - Needs Attention</SelectItem>
                        <SelectItem value="high">High - Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      How urgent is this issue?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Preferred Service Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select a preferred date for service (within the next month)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0 flex justify-end">
              <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Service Request"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
