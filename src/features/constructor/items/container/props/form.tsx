"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { Input } from "@/shared/ui/input"
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
			direction: item.data.direction,
			padding: String(item.data.padding),
			gap: String(item.data.gap)
		}
	})

	const onSubmit = (data: ContainerPropsSchema) => {
		editItem(item.id, {
			...data,
			padding: Number(data.padding),
			gap: Number(data.gap)
		})
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				onChange={form.handleSubmit(onSubmit)}
				className="my-2 grid gap-4"
			>
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
										onSubmit({
											...form.getValues(),
											direction: value as "row" | "col"
										})
									}}
									value={field.value}
									className="flex flex-col"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="row"
											id="option-row"
										/>
										<Label htmlFor="option-row">Row</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											value="col"
											id="option-col"
										/>
										<Label htmlFor="option-col">Col</Label>
									</div>
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="padding"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Внутренний отступ</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									min={0}
									max={64}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="gap"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Отступ между содержимым</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									min={0}
									max={64}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}
