'use client'
import { TrendingsCard } from "@/components/custom/cards/trendingsCard";
import { CustomLineChart } from "@/components/custom/charts/line";
import { FormSchemaType } from "@/components/custom/form/compostForm";
import { InvestmentForm } from "@/components/custom/form/createForm";
import { ModeToggle } from "@/components/custom/modeToggle/modeToggle";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Investimento() {
  const [data, setData] = useState<FormSchemaType>({ initialValue: 100, monthlyDeposit: 0 , creationDate: new Date()} as FormSchemaType)

  // useEffect(() => {
  //   console.log('data> ', data)
  // }, [data])
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[60vw] p-8 gap-4">
        <CustomLineChart data={data} />
        <div className="flex">
          <div className="w-[80%] ">
            <InvestmentForm data={data} setData={setData} />
          </div>
          <div className="w-[50%]">
          </div>
        </div>
      </div>
    </div>
  );
}
