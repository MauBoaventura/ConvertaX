"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { useEffect } from "react"

export type FormSchemaType = z.infer<typeof FormSchema>;

// Define schema for investment form
const FormSchema = z.object({
    owner: z.string().min(2, {
        message: "Owner must be at least 2 characters.",
    }),
    creationDate: z.date().max(new Date(), {
        message: "Creation date cannot be in the future.",
    }),
    initialValue: z.number().min(0, {
        message: "Initial value must be non-negative.",
    }),
})

export function InvestmentForm({ data, setData}: { data: FormSchemaType, setData: any}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            owner: "",
            initialValue: 100,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setData(data)
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })

    }

    useEffect(() => {
        // Observe changes to initialValue
        const subscription = form.watch((value) => {
            setData({...data, initialValue: value.initialValue})
        });

        // Cleanup subscription on unmount
        return () => subscription.unsubscribe();
    }, [form]);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="owner"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Owner</FormLabel>
                            <FormControl>
                                <Input placeholder="Owner Name" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter the owners name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="creationDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] pl-3 text-left font-normal",
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
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                Your date of birth is used to calculate your age.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="initialValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Initial Value</FormLabel>
                            <FormControl>
                                {/* <Input type="number" min="0" placeholder="0.00" {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))} /> */}
                                <Input
                                    type="number"
                                    step="0.0001"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormDescription>
                                Enter the initial value (non-negative).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}




