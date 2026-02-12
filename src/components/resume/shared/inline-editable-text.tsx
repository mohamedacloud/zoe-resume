import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/style";

type InlineEditableTextProps = Omit<React.ComponentProps<"span">, "onChange"> & {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	as?: "span" | "a";
	href?: string;
};

export function InlineEditableText({
	value,
	onChange,
	placeholder,
	className,
	as = "span",
	href,
	...props
}: InlineEditableTextProps) {
	const ref = useRef<HTMLElement>(null);
	const [isFocused, setIsFocused] = useState(false);
	const isEmpty = value.trim().length === 0;
	const Comp = as;

	useEffect(() => {
		if (!ref.current) return;
		if (isFocused) return;
		ref.current.textContent = value;
	}, [value, isFocused]);

	return (
		<span className="relative">
			{placeholder && isEmpty && (
				<span className="pointer-events-none absolute left-0 top-0 text-muted-foreground">
					{placeholder}
				</span>
			)}
			<Comp
				ref={ref as React.Ref<any>}
				href={as === "a" ? href : undefined}
				contentEditable
				suppressContentEditableWarning
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onClick={(event) => {
					if (as === "a") event.preventDefault();
				}}
				onInput={(event) => {
					onChange((event.currentTarget as HTMLElement).textContent ?? "");
				}}
				className={cn("inline-block min-w-[4ch]", className)}
				{...props}
			/>
		</span>
	);
}
