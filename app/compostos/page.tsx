'use client'
import { TrendingsCard } from "@/components/custom/cards/trendingsCard";
import { CustomLineChart } from "@/components/custom/charts/line";
import { InvestmentCompostForm } from "@/components/custom/form/compostForm";
import { FormSchemaType, InvestmentForm } from "@/components/custom/form/createForm";
import { ModeToggle } from "@/components/custom/modeToggle/modeToggle";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Investimento() {
  const [data, setData] = useState<FormSchemaType>({ initialValue: 100 } as FormSchemaType)

  useEffect(() => {
    console.log('data> ', data)
  }, [data])
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[60vw] p-8 gap-4">
        <CustomLineChart initialInvestiment={data.initialValue} />
        <div className="flex">
          <div className="w-[80%] ">
            <InvestmentCompostForm data={data} setData={setData} />
          </div>
          <div className="w-[50%]">
            {/* <TrendingsCard /> */}
          </div>
        </div>

      </div>
      <div className="fixed bottom-4 right-4">
          <ModeToggle />
      </div>
    </div>
  );
}
