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
import { FormSchemaType } from "../form/compostForm"
import { FormSchemaType as FormSchemaRemovalType } from "@/components/custom/form/removalForm";


export function ListRemoval({ data, investiment }: { data: FormSchemaRemovalType[], investiment: FormSchemaType }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-full">Data</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Remove</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((invoice, index) => (
                    <TableRow key={index}>
                        <TableCell className="font-medium">{(invoice.dataRetirada).toLocaleDateString("pt-BR", {
                            month: "short",
                            year: "numeric",
                        })}</TableCell>
                        <TableCell>{invoice.valorRetirado}</TableCell>
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
                ))}
            </TableBody>
        </Table>
    )
}
