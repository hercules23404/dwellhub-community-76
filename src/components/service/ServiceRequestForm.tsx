
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, Star } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Define the form schema with zod
const formSchema = z.object({
  serviceType: z.string({
    required_error: "Please select a service type",
  }),
  serviceProvider: z.string().optional(),
  date: z.date({
    required_error: "Please select a date",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters",
  }),
  contactNumber: z.string().min(10, {
    message: "Please enter a valid contact number",
  }),
});

// Mock data for service providers
const serviceProviders = [
  {
    id: "1",
    name: "John Smith",
    role: "Plumber",
    avatar: "/placeholder.svg",
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Maria Garcia",
    role: "Electrician",
    avatar: "/placeholder.svg",
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: "3",
    name: "Robert Johnson",
    role: "Carpenter",
    avatar: "/placeholder.svg",
    rating: 4.7,
    reviewCount: 56,
  },
  {
    id: "4",
    name: "Emily Chen",
    role: "Plumber",
    avatar: "/placeholder.svg",
    rating: 4.5,
    reviewCount: 42,
  },
];

// Time slots
const timeSlots = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "12:00 PM - 02:00 PM",
  "02:00 PM - 04:00 PM",
  "04:00 PM - 06:00 PM",
];

// Service types
const serviceTypes = [
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Cleaning",
  "Painting",
  "HVAC",
  "Appliance Repair",
  "Locksmith",
];

export function ServiceRequestForm() {
  const [selectedServiceType, setSelectedServiceType] = useState<string>("");
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
      contactNumber: "",
    },
  });

  // Filter service providers based on selected service type
  const filteredProviders = serviceProviders.filter(
    (provider) => provider.role.toLowerCase() === selectedServiceType.toLowerCase()
  );

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Service request submitted successfully!");
      form.reset();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Request a Service</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedServiceType(value);
                    form.setValue("serviceProvider", "");
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {serviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the type of service you need assistance with.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {selectedServiceType && filteredProviders.length > 0 && (
            <div className="space-y-3">
              <FormLabel>Select a Service Provider</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProviders.map((provider) => (
                  <Card 
                    key={provider.id}
                    className={cn(
                      "cursor-pointer hover-scale transition-all",
                      form.getValues("serviceProvider") === provider.id
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    )}
                    onClick={() => form.setValue("serviceProvider", provider.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 border">
                          <AvatarImage src={provider.avatar} alt={provider.name} />
                          <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="text-base font-medium">{provider.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">{provider.role}</Badge>
                            <div className="flex items-center">
                              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm ml-1">{provider.rating}</span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({provider.reviewCount} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Date</FormLabel>
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
                            <span>Select a date</span>
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
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select a date for the service appointment.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {slot}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose your preferred time slot.
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
                <FormLabel>Description of Issue</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the issue in detail..."
                    className="resize-none min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide details about the problem that needs attention.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="contactNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormDescription>
                  The service provider will use this number to contact you.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full sm:w-auto">
            Submit Service Request
          </Button>
        </form>
      </Form>
    </div>
  );
}
