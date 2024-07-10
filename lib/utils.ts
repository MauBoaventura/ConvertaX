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

type FormSchemaType = {
  dataRetirada: Date;
  valorRetirado: number;
};

export function calcularJurosCompostos(
  valorInicial: number,
  dataInicial: string,
  meses: number,
  mounthlydeposit: number,
  retiradas: FormSchemaType[] = [],
  taxa: number = 0.0052
): ResultadoInvestimento[] {
  function calcular(
    valor: number,
    data: Date,
    mesesRestantes: number,
    valorBruto: number,
    resultado: ResultadoInvestimento[] = [],
    jurosSaque: number = 0
  ): ResultadoInvestimento[] {
    if (mesesRestantes === 0) {
      return resultado;
    }

    const retirada = retiradas.find(
      (r) => r.dataRetirada.getFullYear() === data.getFullYear() && r.dataRetirada.getMonth() === data.getMonth()
    );

    let novoValor = (valor + mounthlydeposit) * (1 + taxa);
    let novoValorBruto = valorBruto + mounthlydeposit;
    let valorEncargo = 0;
    let tipoEncargo = 0; // 0 para nenhum, 1 para menos de um ano, 2 para entre um e dois anos

    if (retirada) {
      const mesesInvestidos = (data.getFullYear() - new Date(dataInicial).getFullYear()) * 12 + data.getMonth() - new Date(dataInicial).getMonth();

      if (mesesInvestidos < 12) {
        valorEncargo = retirada.valorRetirado * 0.225;
        tipoEncargo = 1;
      } else if (mesesInvestidos < 24) {
        valorEncargo = retirada.valorRetirado * 0.185;
        tipoEncargo = 2;
      } else {
        valorEncargo = retirada.valorRetirado * 0.15;
        tipoEncargo = 1;
      }

      novoValor -= (retirada.valorRetirado + valorEncargo);
      jurosSaque += valorEncargo;
    }

    const novaData = new Date(data);
    novaData.setMonth(novaData.getMonth() + 1);
    resultado.push({
      data: formatarData(novaData),
      valorReajustado: parseFloat(novoValor.toFixed(2)),
      valorBrutoInvestido: parseFloat(novoValorBruto.toFixed(2)),
      inicial: valorInicial,
      jurosSaque: parseFloat(jurosSaque.toFixed(2)),
      tipoEncargo
    });

    return calcular(novoValor, novaData, mesesRestantes - 1, novoValorBruto, resultado, jurosSaque);
  }

  const dataInicialDate = new Date(dataInicial);
  return calcular(valorInicial, dataInicialDate, meses, valorInicial);
}
