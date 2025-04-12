
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaintenanceRequestFormValues } from "@/types/maintenance";
import { createMaintenanceRequest } from "@/lib/api/maintenance";

const maintenanceRequestSchema = z.object({
  issue_type: z.string().min(2, "Issue type must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

const issueTypes = [
  "Plumbing",
  "Electrical",
  "HVAC",
  "Appliance",
  "Structural",
  "Pest Control",
  "Cleaning",
  "Other"
];

interface MaintenanceRequestFormProps {
  societyId: string;
  onSuccess?: () => void;
}

export function MaintenanceRequestForm({ societyId, onSuccess }: MaintenanceRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<MaintenanceRequestFormValues>({
    resolver: zodResolver(maintenanceRequestSchema),
    defaultValues: {
      issue_type: "",
      description: "",
    },
  });

  const onSubmit = async (data: MaintenanceRequestFormValues) => {
    setIsSubmitting(true);
    try {
      await createMaintenanceRequest({
        society_id: societyId,
        ...data,
      });
      
      form.reset();
      toast.success("Maintenance request submitted successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to submit maintenance request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit a Maintenance Request</CardTitle>
        <CardDescription>
          Fill out the form below to request maintenance for your property
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="issue_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Type</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select issue type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {issueTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please describe your issue in detail"
                      className="min-h-[120px]"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
