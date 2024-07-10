import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FormSchemaType as FormSchemaRemovalType } from "@/components/custom/form/removalForm";
import { ResultadoInvestimento } from "@/types";


export function ListRemoval({ data, investiment }: { data: FormSchemaRemovalType[], investiment: ResultadoInvestimento[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="w-full col-span-3">
                    <TableHead className="">Retiradas programadas</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="w-full">Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Impostos</TableHead>
                    <TableHead>Taxa</TableHead>
                    <TableHead>Remove</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((invoice, index) => {
                    const matchingInvestment = investiment.find(invest => {
                        const investDate = new Date(invest.data);
                        return investDate.getMonth() - 1 === invoice.dataRetirada.getMonth() &&
                            investDate.getFullYear() === invoice.dataRetirada.getFullYear();
                    });
                    // console.log(matchingInvestment);
                    return (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                {invoice.dataRetirada.toLocaleDateString("pt-BR", {
                                    month: "short",
                                    year: "numeric",
                                })}
                            </TableCell>
                            <TableCell>R${invoice.valorRetirado}</TableCell>
                            <TableCell>R${matchingInvestment ? matchingInvestment.jurosSaque : "N/A"}</TableCell>
                            <TableCell>{(matchingInvestment && matchingInvestment.tipoEncargo === 1 ? '22,5' : matchingInvestment && matchingInvestment.tipoEncargo === 2 ? '18,5' : '15')}%</TableCell>
                            <TableCell>
                                <button
                                    onClick={() => {
                                        const dateRemoval = JSON.parse(localStorage.getItem("dateRemoval") || "[]");
                                        dateRemoval.splice(index, 1);
                                        localStorage.setItem("dateRemoval", JSON.stringify(dateRemoval));
                                        window.location.reload();
                                    }}
                                    className="text-red-500 border-2 border-red-500 rounded-md px-2 py-1 hover:bg-red-500 hover:text-white"
                                >
                                    X
                                </button>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
