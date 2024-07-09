import { CustomLineChart } from "@/components/custom/charts/line";
import { InvestmentForm } from "@/components/custom/form/createForm";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <CustomLineChart />
      <InvestmentForm />
    </>
  );
}
