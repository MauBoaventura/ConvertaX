'use client'
import { TrendingsCard } from "@/components/custom/cards/trendingsCard";
import { CustomLineChart } from "@/components/custom/charts/line";
import { FormSchemaType } from "@/components/custom/form/compostForm";
import { FormSchemaType as FormSchemaRemovalType } from "@/components/custom/form/removalForm";
import { InvestmentForm } from "@/components/custom/form/createForm";
import { RemovalForm } from "@/components/custom/form/removalForm";
import { ModeToggle } from "@/components/custom/modeToggle/modeToggle";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Investimento() {
  const [data, setData] = useState<FormSchemaType>({ initialValue: 100, monthlyDeposit: 0, creationDate: new Date() } as FormSchemaType)
  const [dateRemoval, setDateRemoval] = useState<FormSchemaRemovalType>({} as FormSchemaRemovalType)

  useEffect(() => {
    console.log('dateRemoval> ', dateRemoval)
  }, [dateRemoval])
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[60vw] p-8 gap-4">
        <CustomLineChart data={data} />
        <div className="flex">
          <div className="w-[80%] ">
            <RemovalForm data={dateRemoval} setData={setDateRemoval} />
          </div>
          <div className="w-[50%]">
          </div>
        </div>
      </div>
    </div>
  );
}
