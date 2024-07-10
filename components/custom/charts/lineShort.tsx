"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { FormSchemaType } from "../form/compostForm"
import { Button } from "@/components/ui/button"
import { calcularJurosCompostos, formatarData } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface ResultadoInvestimento {
    data: string;
    valorReajustado: number;
    inicial: number;
}

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
        label: "Deposito",
        color: "hsl(var(--chart-3))",
    },
} satisfies ChartConfig

export function CustomLineShortChart({ data }: { data: FormSchemaType }) {
    const { initialValue: initialInvestiment, monthlyDeposit: mounthlydeposit, creationDate } = data
    const [timeRange, setTimeRange] = React.useState("1y")

    const router = useRouter();

    const handleButtonClick = () => {
        const dataString = JSON.stringify(data);
        router.push(`/retirada?dataState=${encodeURIComponent(dataString)}`);
    };

    const investimentoInicial = initialInvestiment ?? 1000.00;
    const dataInicial = formatarData(creationDate) ?? '2024-07-01';
    const meses = timeRange === "1y" ? 12 : timeRange === "2y" ? 24 : timeRange === "5y" ? 60 : timeRange === "10y" ? 120 : timeRange === "15y" ? 180 : timeRange === "20y" ? 240 : 0;
    const chartData = calcularJurosCompostos(investimentoInicial, dataInicial, meses, mounthlydeposit);

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.data);
        const now = new Date();
        let daysToSubtract = 90;
        if (timeRange === "1y") {
            daysToSubtract = 365;
        } else if (timeRange === "2y") {
            daysToSubtract = 365 * 2;
        } else if (timeRange === "5y") {
            daysToSubtract = 365 * 5;
        } else if (timeRange === "10y") {
            daysToSubtract = 365 * 10;
        } else if (timeRange === "15y") {
            daysToSubtract = 365 * 15;
        } else if (timeRange === "20y") {
            daysToSubtract = 365 * 20;
        }
        now.setDate(now.getDate() - daysToSubtract);
        return date >= now;
    });

    return (
        <Card>
            <CardTitle className="p-4">Proprietário: {data.owner}</CardTitle>
            <CardDescription className="text-sm font-semibold px-4">Data inicio: {new Date(data.creationDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric", })} </CardDescription>
            <CardDescription className="text-sm font-semibold px-4"> Investimento inicial - R$ {data.initialValue}</CardDescription>
            <CardDescription className="text-sm font-semibold px-4"> Depositos Mensais - R$ {data.monthlyDeposit}</CardDescription>
            <CardDescription className="text-sm font-semibold px-4"> Rendimentos em 12 meses - R$ {filteredData[filteredData.length - 1]?.valorReajustado}</CardDescription>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[150px]"
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
                            stroke="var(--color-brutoInvestido)"
                            stackId="c"
                        />
                        {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    </AreaChart>
                </ChartContainer>
                <div className="flex flex-col">
                    <span className="text-xs my-4">
                        *Previsão para os proximos 12 meses
                    </span>
                    <Button type="submit" onClick={handleButtonClick}>Retirada</Button>
                </div>

            </CardContent>
            {/* <CardFooter className="text-sm p-4">
            </CardFooter> */}
        </Card>
    )
}
