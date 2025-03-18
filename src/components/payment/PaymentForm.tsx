
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, CheckCircle, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

const paymentFormSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvc: z.string().optional(),
  nameOnCard: z.string().optional(),
  description: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export function PaymentForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      amount: "1200.00",
      paymentMethod: "card",
      description: "Monthly Rent Payment",
    },
  });

  function onSubmit(data: PaymentFormValues) {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (step === 2) {
      setIsProcessing(true);
      // Simulate payment processing
      setTimeout(() => {
        setIsProcessing(false);
        setStep(3);
        setIsComplete(true);
        toast({
          title: "Payment Successful",
          description: `You have successfully paid $${data.amount}`,
        });
      }, 2000);
    }
  }

  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center py-10 space-y-4">
        <div className="rounded-full bg-green-100 p-3">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold">Payment Complete!</h3>
        <p className="text-center text-muted-foreground max-w-md">
          Your payment of ${form.getValues().amount} has been processed successfully. 
          A receipt has been sent to your email.
        </p>
        <div className="flex gap-4 mt-6">
          <Button variant="outline" onClick={() => {
            setStep(1);
            setIsComplete(false);
            form.reset();
          }}>
            Make Another Payment
          </Button>
          <Button onClick={() => window.print()}>
            Print Receipt
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Amount ($)</FormLabel>
                  <FormControl>
                    <Input placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the amount you wish to pay
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Monthly Rent" {...field} />
                  </FormControl>
                  <FormDescription>
                    What is this payment for?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Alert>
              <AlertDescription>
                You will be charged ${form.watch("amount") || "0.00"} for {form.watch("description") || "your payment"}.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full">
              Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Enter Card Details</h3>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nameOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name on Card</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Card Number</FormLabel>
                      <FormControl>
                        <Input placeholder="1234 5678 9012 3456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cardExpiry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input placeholder="MM/YY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cardCvc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CVC</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <Alert>
              <AlertDescription>
                You will be charged ${form.getValues().amount} for {form.getValues().description}.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" type="button" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button type="submit" className="flex-1" disabled={isProcessing}>
                {isProcessing ? (
                  <div className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span> Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Pay ${form.getValues().amount}
                  </div>
                )}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
