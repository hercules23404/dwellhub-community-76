
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormValues } from "./ServiceRequestForm";

interface PropertySelectionProps {
  form: UseFormReturn<ServiceFormValues>;
  properties: { value: string; label: string }[];
}

export function PropertySelection({ form, properties }: PropertySelectionProps) {
  return (
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
  );
}
