
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceFormFields } from "./ServiceFormFields";
import { PropertySelection } from "./PropertySelection";
import { ServicePriorityAndDate } from "./ServicePriorityAndDate";
import { useServiceRequest, categories } from "./useServiceRequest";

export const serviceSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(10, "Description must be at least 10 characters").max(500),
  category: z.string({ required_error: "Please select a category" }),
  priority: z.string({ required_error: "Please select a priority" }),
  propertyId: z.string({ required_error: "Please select a property" }),
  unitNumber: z.string().min(1, "Unit number is required"),
  scheduledDate: z.date().optional(),
});

export type ServiceFormValues = z.infer<typeof serviceSchema>;

export function ServiceRequestForm() {
  const { form, isSubmitting, onSubmit, properties } = useServiceRequest();

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
            <ServiceFormFields form={form} categories={categories} />
            <PropertySelection form={form} properties={properties} />
            <ServicePriorityAndDate form={form} />

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
