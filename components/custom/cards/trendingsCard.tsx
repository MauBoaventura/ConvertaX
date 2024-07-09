import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
const rendimentos = [
    {
        rendimento: "IAPC001",
        status: "Boa",
        timeReturn: "2 anos",
        taxes: "R$250.00",
        initialInvestment: "R$10,000.00",
    },
    {
        rendimento: "CREDITUR002",
        status: "Muito Boa",
        timeReturn: "10 anos",
        taxes: "R$150.00",
        initialInvestment: "R$5,000.00",
    },
    {
        rendimento: "GALET554",
        status: "Ruim",
        timeReturn: "15 anos",
        taxes: "R$350.00",
        initialInvestment: "R$20,000.00",
    },
    {
        rendimento: "FUND005",
        status: "Excelente",
        timeReturn: "1 anos",
        taxes: "R$450.00",
        initialInvestment: "R$15,000.00",
    },
    {
        rendimento: "INV005",
        status: "Analise",
        timeReturn: "5 anos",
        taxes: "R$550.00",
        initialInvestment: "R$25,000.00",
    },
    {
        rendimento: "CSJB55",
        status: "Regular",
        timeReturn: "12 anos",
        taxes: "R$200.00",
        initialInvestment: "R$8,000.00",
    },
    {
        rendimento: "VALE005",
        status: "Boa",
        timeReturn: "5 anos",
        taxes: "R$300.00",
        initialInvestment: "R$12,000.00",
    },
]
  export function TrendingsCard() {
    return (
      <Table>
        <TableCaption>A list of your recent rendimentos.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Transação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Periodo Minimo</TableHead>
            <TableHead className="text-right">Investimento inicial</TableHead>
            <TableHead className="text-right">Rendimento ao mês*</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rendimentos.map((rendimento) => (
            <TableRow key={rendimento.rendimento}>
              <TableCell className="font-medium">{rendimento.rendimento}</TableCell>
              <TableCell>{rendimento.status}</TableCell>
              <TableCell>{rendimento.timeReturn}</TableCell>
              <TableCell className="text-right">{rendimento.initialInvestment}</TableCell>
              <TableCell className="text-right">{rendimento.taxes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  }
  