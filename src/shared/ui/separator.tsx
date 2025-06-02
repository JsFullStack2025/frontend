type Props = {
	label?: string
}
export function Separator({ label }: Props) {
	return (
		<div className="relative mb-2">
			<div className="absolute inset-0 flex items-center">
				<span className="border-border w-full border-t" />
			</div>
			<div className="relative flex h-4 justify-center text-xs uppercase">
				{label && (
					<span className="bg-background text-muted-foreground px-2">
						{label}
					</span>
				)}
			</div>
		</div>
	)
}
