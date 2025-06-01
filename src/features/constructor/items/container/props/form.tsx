"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useConstructor } from "@/features/constructor/context/constructor.context"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/shared/ui/form"
import { Label } from "@/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group"

import { ConstructorItem } from "../../../types/item.types"
import { ContainerItemData } from "../types"

import { ContainerPropsSchema, containerPropsSchema } from "./schema"

type Props = {
	item: ConstructorItem<ContainerItemData>
}

export function ContainerItemPropsForm({ item }: Props) {
	const { editItem } = useConstructor()

	const form = useForm<ContainerPropsSchema>({
		resolver: zodResolver(containerPropsSchema),
		mode: "onChange",
		defaultValues: {
			direction: item.data.direction
		}
	})

	useEffect(() => {
		form.reset({ direction: item.data.direction })
	}, [item.data.direction])

	const onSubmit = (data: ContainerPropsSchema) => {
		editItem(item.id, data)
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="my-2 grid gap-4">
				<FormField
					control={form.control}
					name="direction"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Direction</FormLabel>
							<FormControl>
								<RadioGroup
									onValueChange={(value) => {
										field.onChange(value)
										onSubmit({ direction: value as "row" | "col" })
									}}
									value={field.value}
									className="flex flex-col"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="row" id="option-row" />
										<Label htmlFor="option-row">Row</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="col" id="option-col" />
										<Label htmlFor="option-col">Col</Label>
									</div>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
