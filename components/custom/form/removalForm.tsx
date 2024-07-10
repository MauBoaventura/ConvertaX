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

// Define schema for withdrawal form
export const FormSchemaValidade = z.object({
    dataRetirada: z.date().min(new Date(), {
        message: "A data de retirada não pode estar no passado.",
    }),
    valorRetirado: z.number().min(0, {
        message: "O valor a ser retirado deve ser não negativo.",
    }),
});

export type FormSchemaType = z.infer<typeof FormSchemaValidade>;

export function RemovalForm({ data, setData, form }: { data: FormSchemaType[], setData: any, form: any }) {

    function onSubmit(dataR: z.infer<typeof FormSchemaValidade>) {
        setData([...data, { ...dataR }])
        toast({
            title: "Você enviou os seguintes valores:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        const dateRemoval = JSON.parse(localStorage.getItem("dateRemoval") || "[]");
        dateRemoval.push({ ...dataR });
        localStorage.setItem("dateRemoval", JSON.stringify(dateRemoval));
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="dataRetirada"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Data de Retirada</FormLabel>
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
                                                <span>Escolha uma data</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown-buttons"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date < new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                        fromYear={2024}
                                        toYear={2060}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="valorRetirado"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor a Ser Retirado</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="0.00"
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                />
                            </FormControl>
                            <FormDescription>
                                Insira o valor a ser retirado (não negativo).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Enviar</Button>
            </form>
        </Form>
    )
}
