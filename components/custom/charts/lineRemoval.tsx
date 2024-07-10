"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { FormSchemaType as FormSchemaRemovalType } from "@/components/custom/form/removalForm";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormSchemaType } from "../form/compostForm"
import { calcularJurosCompostos, formatarData } from "@/lib/utils"
import { ResultadoInvestimento } from "@/types";

const chartConfig = {
    valorReajustado: {
        label: "Disponivel",
        color: "hsl(var(--chart-2))",
    },
    inicial: {
        label: "Inicial",
        color: "hsl(var(--chart-1))",
    },
    valorBrutoInvestido: {
        label: "Bruto",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function CustomLineRemovalChart({ data, filteredData, meses , timeRange,setTimeRange}: { data: FormSchemaType, filteredData: ResultadoInvestimento [], meses: number, timeRange: string, setTimeRange: React.Dispatch<React.SetStateAction<string>>}) {
    const { initialValue: initialInvestiment, monthlyDeposit: mounthlydeposit, creationDate } = data


    return (
        <Card>
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Grafico Interativo</CardTitle>
                    <CardDescription>
                        Previsao de investimento de R$ {data.initialValue} em {meses} meses
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="w-[160px] rounded-lg sm:ml-auto"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="1y" className="rounded-lg">
                            Last 1 year
                        </SelectItem>
                        <SelectItem value="2y" className="rounded-lg">
                            Last 2 years
                        </SelectItem>
                        <SelectItem value="5y" className="rounded-lg">
                            Last 5 years
                        </SelectItem>
                        <SelectItem value="10y" className="rounded-lg">
                            Last 10 years
                        </SelectItem>
                        <SelectItem value="15y" className="rounded-lg">
                            Last 15 years
                        </SelectItem>
                        <SelectItem value="20y" className="rounded-lg">
                            Last 20 years
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-valorReajustado)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-valorReajustado)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                            <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-inicial)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-inicial)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="data"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("pt-BR", {
                                    month: "short",
                                    year: "numeric",
                                })
                            }}
                        />
                        <YAxis
                            dataKey="valorReajustado"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            dataKey="inicial"
                            tickLine={false}
                            axisLine={false}
                        // tickMargin={1}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            year: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />

                        <Area
                            dataKey="valorReajustado"
                            type="natural"
                            fill="url(#fillDesktop)"
                            stroke="var(--color-valorReajustado)"
                            stackId="b"
                        />
                        <Area
                            dataKey="inicial"
                            type="natural"
                            fill="none"
                            stroke="var(--color-inicial)"
                            stackId="a"
                        />
                        <Area
                            dataKey="valorBrutoInvestido"
                            type="natural"
                            fill="none"
                            stroke="var(--color-inicial)"
                            stackId="c"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
