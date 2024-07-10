'use client'
import { TrendingsCard } from "@/components/custom/cards/trendingsCard";
import { CustomLineRemovalChart } from "@/components/custom/charts/lineRemoval";
import { FormSchemaType } from "@/components/custom/form/compostForm";
import { FormSchemaType as FormSchemaRemovalType, FormSchemaValidade } from "@/components/custom/form/removalForm";
import { InvestmentForm } from "@/components/custom/form/createForm";
import { RemovalForm } from "@/components/custom/form/removalForm";
import { ModeToggle } from "@/components/custom/modeToggle/modeToggle";
import Image from "next/image";
import React, { use, useEffect, useState } from "react";
import { ListRemoval } from "@/components/custom/list/listRemoval";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { calcularJurosCompostos, formatarData } from "@/lib/utils";


export default function Investimento({ initialValues }: { initialValues: FormSchemaType }) {
  const [data, setData] = useState<FormSchemaType>({ initialValue: 100, monthlyDeposit: 0, creationDate: new Date() } as FormSchemaType)
  const [dateRemoval, setDateRemoval] = useState<FormSchemaRemovalType[]>([] as FormSchemaRemovalType[])
  const [timeRange, setTimeRange] = React.useState("1y")

  useEffect(() => {
    const dados = (localStorage.getItem('dateRemoval') ? JSON.parse(localStorage.getItem('dateRemoval') as string) : [] as FormSchemaRemovalType[])
    setDateRemoval(dados.map((item: any) => {
      return {
        dataRetirada: new Date(item.dataRetirada),
        valorRetirado: item.valorRetirado
      }
    }))
    initialValues && setData(initialValues)
  }, [])
  const form = useForm<z.infer<typeof FormSchemaValidade>>({
    resolver: zodResolver(FormSchemaValidade),
    defaultValues: {
      dataRetirada: new Date(),
      valorRetirado: 0,
    },
  })


  const investimentoInicial = data.initialValue ?? 1000.00;
  const dataInicial = formatarData(data.creationDate) ?? '2024-07-01';
  const meses = timeRange === "1y" ? 12 : timeRange === "2y" ? 24 : timeRange === "5y" ? 60 : timeRange === "10y" ? 120 : timeRange === "15y" ? 180 : timeRange === "20y" ? 240 : 0;
  const chartData = calcularJurosCompostos(investimentoInicial, dataInicial, meses, data.monthlyDeposit, dateRemoval);
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
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[60vw] p-8 gap-4">
        <CustomLineRemovalChart data={data} filteredData={filteredData} meses={meses} timeRange={timeRange} setTimeRange={setTimeRange} />
        <div className="flex">
          <div className="w-[80%] ">
            <RemovalForm data={dateRemoval} setData={setDateRemoval} form={form} />
          </div>
          <div className="w-[50%]">
            <ListRemoval data={dateRemoval} investiment={data} />
          </div>
        </div>
      </div>
    </div>
  );
}
