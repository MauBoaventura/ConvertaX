"use client"

import * as React from "react"
import { CustomLineChart } from "../charts/line"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { CustomLineShortChart } from "../charts/lineShort"
import { FormSchemaType } from "../form/compostForm"
import { formatarData } from "@/lib/utils"

export default function CardInvestiment() {
    const formDataArray = (JSON.parse(localStorage.getItem("formDataArray") || "[]") as []).map((data: FormSchemaType) => {
        return { ...data, creationDate: (new Date(data.creationDate)) }
    })
    console.log('formDataArray> ', formDataArray)
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {formDataArray.map((data: any, index: number) => (
                <CustomLineShortChart key={index} data={data as FormSchemaType} />
            ))}
        </div>
    );
}
