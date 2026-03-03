import { debounce } from "es-toolkit";
import { useEffect, useMemo, useRef, useState } from "react";
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

	const debouncedOnChange = useMemo(() => debounce(onChange, 100), [onChange]);

	return (
		<span className="relative">
			{placeholder && isEmpty && (
				<span className="pointer-events-none absolute top-0 left-0 text-muted-foreground">{placeholder}</span>
			)}
			<Comp
				// biome-ignore lint/suspicious/noExplicitAny: ref needs to be any for dynamic component support between span and a
				ref={ref as any}
				href={as === "a" ? href : undefined}
				contentEditable
				suppressContentEditableWarning
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				onClick={(event) => {
					if (as === "a") event.preventDefault();
				}}
				onInput={(event) => {
					debouncedOnChange((event.currentTarget as HTMLElement).textContent ?? "");
				}}
				className={cn(
					"break-anywhere inline-block min-w-[4ch] max-w-full cursor-text rounded-sm outline-none hover:ring-1 hover:ring-blue-300 focus:ring-2 focus:ring-blue-500",
					className,
				)}
				{...props}
			/>
		</span>
	);
}
