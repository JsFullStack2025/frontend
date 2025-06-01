"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Bold, Italic, Underline } from "lucide-react"
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
import { Textarea } from "@/shared/ui/textarea"
import { Toggle } from "@/shared/ui/toggle"

import { ConstructorItem } from "../../../types/item.types"
import { LabelItemData } from "../types"

import { LabelPropsSchema, labelPropsSchema } from "./schema"

type Props = {
	item: ConstructorItem<LabelItemData>
}

export function LabelItemPropsForm({ item }: Props) {
	const { editItem } = useConstructor()

	const form = useForm<LabelPropsSchema>({
		resolver: zodResolver(labelPropsSchema),
		mode: "onChange",
		defaultValues: {
			text: item.data.text || "",
			bold: item.data.bold || false,
			italic: item.data.italic || false,
			underline: item.data.underline || false,
			fontSize: String(item.data.fontSize) || "12"
		}
	})

	const onSubmit = (data: LabelPropsSchema) => {
		editItem(item.id, {
			...data,
			fontSize: Number(data.fontSize)
		})
		console.log(data)
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
					name="text"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Текст</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Введите текст"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex gap-2">
					<FormField
						control={form.control}
						name="bold"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Toggle
										pressed={field.value}
										onPressedChange={(value) => {
											field.onChange(value)
											form.handleSubmit(onSubmit)()
										}}
										aria-label="Toggle bold"
									>
										<Bold />
									</Toggle>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="italic"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Toggle
										pressed={field.value}
										onPressedChange={(value) => {
											field.onChange(value)
											form.handleSubmit(onSubmit)()
										}}
										aria-label="Toggle italic"
									>
										<Italic />
									</Toggle>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="underline"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Toggle
										pressed={field.value}
										onPressedChange={(value) => {
											field.onChange(value)
											form.handleSubmit(onSubmit)()
										}}
										aria-label="Toggle underline"
									>
										<Underline />
									</Toggle>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="fontSize"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Размер шрифта</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									min={1}
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
