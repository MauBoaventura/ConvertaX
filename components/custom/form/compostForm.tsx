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
        message: "O proprietário deve ter pelo menos 2 caracteres.",
    }),
    creationDate: z.date().max(new Date(), {
        message: "A data de criação não pode estar no futuro.",
    }),
    initialValue: z.number().min(0, {
        message: "O valor inicial deve ser não negativo.",
    }),
    monthlyDeposit: z.number().min(0, {
        message: "O depósito mensal deve ser não negativo.",
    }),
})

export function InvestmentCompostForm({ data, setData}: { data: FormSchemaType, setData: any}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            owner: "",
            initialValue: 100,
            monthlyDeposit: 0,
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setData(data)
        toast({
            title: "Você enviou os seguintes valores:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })

    }

    useEffect(() => {
        // Observar alterações no valor inicial
        const subscription = form.watch((value) => {
            setData({...data, initialValue: value.initialValue, monthlyDeposit: value.monthlyDeposit})
        });

        // Limpar a assinatura ao desmontar
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
                            <FormLabel>Proprietário</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do Proprietário" {...field} />
                            </FormControl>
                            <FormDescription>
                                Insira o nome do proprietário.
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
                            <FormLabel>Data inicial do investimento</FormLabel>
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
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="initialValue"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Valor Inicial</FormLabel>
                            <FormControl>
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
                                Insira o valor inicial (não negativo).
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="monthlyDeposit"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Depósito Mensal</FormLabel>
                            <FormControl>
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
                                Insira o valor do depósito mensal (não negativo).
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
