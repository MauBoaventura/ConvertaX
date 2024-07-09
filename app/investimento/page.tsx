'use client'
import { CustomLineChart } from "@/components/custom/charts/line";
import { FormSchemaType, InvestmentForm } from "@/components/custom/form/createForm";
import Image from "next/image";
import { use, useEffect, useState } from "react";

export default function Investimento() {
  const [data, setData] = useState<FormSchemaType>({ initialValue: 0 } as FormSchemaType)

  useEffect(() => {
    console.log('data> ', data)
  }, [data])
  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center w-[60vw] p-8">
        <CustomLineChart initialInvestiment={data.initialValue} />
        <InvestmentForm data={data} setData={setData} />
      </div>
    </div>
  );
}
