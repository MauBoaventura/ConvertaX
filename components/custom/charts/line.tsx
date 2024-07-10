"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
} satisfies ChartConfig

export function CustomLineChart({ initialInvestiment, mounthlydeposit}: { initialInvestiment: number, mounthlydeposit: number}) {
    const [timeRange, setTimeRange] = React.useState("1y")


    function calcularJurosCompostos(
        valorInicial: number,
        dataInicial: string,
        meses: number,
        taxa: number = 0.0052
    ): ResultadoInvestimento[] {

        function formatarData(date: Date): string {
            const ano = date.getFullYear();
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            return `${ano}-${mes}-02`;
        }

        function calcular(
            valor: number,
            data: Date,
            mesesRestantes: number,
            resultado: ResultadoInvestimento[] = []
        ): ResultadoInvestimento[] {
            if (mesesRestantes === 0) {
                return resultado;
            }

            const novoValor = (valor + mounthlydeposit) * (1 + taxa);
            const novaData = new Date(data);
            novaData.setMonth(novaData.getMonth() + 1);
            resultado.push({
                data: formatarData(novaData),
                valorReajustado: parseFloat((valor + mounthlydeposit).toFixed(2)),
                inicial: valorInicial
            });

            return calcular(novoValor, novaData, mesesRestantes - 1, resultado);
        }

        const dataInicialDate = new Date(dataInicial);
        return calcular(valorInicial, dataInicialDate, meses);
    }
    const investimentoInicial = initialInvestiment ??  1000.00;
    const dataInicial = '2024-07-01';
    const meses = 24;

    const chartData = calcularJurosCompostos(investimentoInicial, dataInicial, timeRange === "1y" ? 12 : timeRange === "2y" ? 24 : timeRange === "5y" ? 60 : timeRange === "10y" ? 120 : timeRange === "15y" ? 180 : timeRange === "20y" ? 240 : 0);
    
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
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1 text-center sm:text-left">
                    <CardTitle>Grafico Interativo</CardTitle>
                    <CardDescription>
                        Previsao de investimento de R$ {investimentoInicial} em {meses} meses
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
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
