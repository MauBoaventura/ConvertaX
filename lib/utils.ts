import { ResultadoInvestimento } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatarData(date: Date): string {
  const ano = date?.getFullYear();
  const mes = String(date?.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}-03`;
}
export function calcularJurosCompostos(
  valorInicial: number,
  dataInicial: string,
  meses: number,
  mounthlydeposit: number,
  taxa: number = 0.0052
): ResultadoInvestimento[] {
  function calcular(
    valor: number,
    data: Date,
    mesesRestantes: number,
    valorBruto: number,
    resultado: ResultadoInvestimento[] = []
  ): ResultadoInvestimento[] {
    if (mesesRestantes === 0) {
      return resultado;
    }

    const novoValor = (valor + mounthlydeposit) * (1 + taxa);
    const novoValorBruto = (valorBruto + mounthlydeposit);
    const novaData = new Date(data);
    novaData.setMonth(novaData.getMonth() + 1);
    resultado.push({
      data: formatarData(novaData),
      valorReajustado: parseFloat(novoValor.toFixed(2)),
      valorBrutoInvestido: parseFloat((valorBruto + mounthlydeposit).toFixed(2)),
      inicial: valorInicial,
    });

    return calcular(novoValor, novaData, mesesRestantes - 1, novoValorBruto, resultado);
  }

  const dataInicialDate = new Date(dataInicial);
  return calcular(valorInicial, dataInicialDate, meses, valorInicial);
}
