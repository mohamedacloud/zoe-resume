import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AIProvider } from "@/integrations/ai/types";
import { orpc } from "@/integrations/orpc/client";
import { Button } from "./button";

type AIGenerateButtonProps = {
	type: "experience" | "projects" | "summary" | "custom";
	data: Record<string, unknown>;
	onGenerated: (content: string) => void;
	disabled?: boolean;
	className?: string;
};

export function AIGenerateButton({ type, data, onGenerated, disabled, className }: AIGenerateButtonProps) {
	// Use environment variables for AI configuration
	const provider = (import.meta.env.VITE_AI_PROVIDER || "gemini") as AIProvider;
	const model = import.meta.env.VITE_AI_MODEL || "gemini-1.5-flash";
	const apiKey = import.meta.env.VITE_AI_API_KEY || "";
	const baseURL = import.meta.env.VITE_AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

	const { mutate: generateContent, isPending } = useMutation(orpc.ai.generateContent.mutationOptions());

	const isConfigured = !!apiKey && !!model;

	const handleGenerate = () => {
		if (!isConfigured) {
			toast.error(t`AI is not configured. Please set VITE_AI_API_KEY and VITE_AI_MODEL in your .env file.`);
			return;
		}

		const toastId = toast.loading(t`Generating content with AI...`);

		generateContent(
			{
				provider,
				model,
				apiKey,
				baseURL,
				type,
				data,
			},
			{
				onSuccess: (content) => {
					toast.success(t`Content generated successfully!`, { id: toastId });
					onGenerated(content);
				},
				onError: (error) => {
					toast.error(error.message || t`Failed to generate content`, { id: toastId });
				},
			},
		);
	};

	const isDisabled = disabled || isPending || !isConfigured;
	const buttonTitle = !isConfigured
		? "Configure AI in .env file (add VITE_AI_API_KEY and VITE_AI_MODEL)"
		: isPending
			? "Asking Zoe..."
			: "Ask Zoe to generate content";

	return (
		<Button
			type="button"
			size="sm"
			variant="outline"
			onClick={handleGenerate}
			disabled={isDisabled}
			title={buttonTitle}
			className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
		>
			<img src="/src/dialogs/resume/zoe-talking.png" alt="" className="size-4" />
			<Trans>Ask Zoe</Trans>
		</Button>
	);
}
