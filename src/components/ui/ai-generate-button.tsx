// components/ui/ai-generate-button.tsx
import { t } from "@lingui/core/macro";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
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
	roundsUsed?: number; // 0, 1, or 2
	maxRounds?: number; // default 2
	isWordCountValid?: boolean;
	onRoundComplete?: () => void;
};

export function AIGenerateButton({
	type,
	data,
	onGenerated,
	disabled,
	className,
	roundsUsed = 0,
	maxRounds = 2,
	isWordCountValid = true,
	onRoundComplete,
}: AIGenerateButtonProps) {
	const isMounted = useRef(true);

	// Use environment variables for AI configuration
	const provider = (import.meta.env.VITE_AI_PROVIDER || "gemini") as AIProvider;
	const model = import.meta.env.VITE_AI_MODEL || "gemini-1.5-flash";
	const apiKey = import.meta.env.VITE_AI_API_KEY || "";
	const baseURL = import.meta.env.VITE_AI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

	const { mutate: generateContent, isPending } = useMutation(orpc.ai.generateContent.mutationOptions());

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isMounted.current = false;
		};
	}, []);

	const isConfigured = !!apiKey && !!model;
	const hasReachedLimit = roundsUsed >= maxRounds;
	const roundsRemaining = Math.max(0, maxRounds - roundsUsed);
	const isLoading = isPending;

	// Add round context to the data
	const enhancedData = {
		...data,
		aiRound: roundsUsed + 1,
		maxRounds: maxRounds,
		isFirstRound: roundsUsed === 0,
		isSecondRound: roundsUsed === 1,
		previousContent: roundsUsed > 0 ? data.description || data.content : undefined,
	};

	const handleGenerate = () => {
		// Prevent multiple clicks while generating
		if (isLoading) {
			console.log("Already generating, ignoring click");
			toast.info(t`Please wait for the current generation to complete.`);
			return;
		}

		if (!isConfigured) {
			toast.error(t`AI is not configured. Please set VITE_AI_API_KEY and VITE_AI_MODEL in your .env file.`);
			return;
		}

		if (!isWordCountValid) {
			toast.error(t`Please write at least 5 words before asking Zoe.`);
			return;
		}

		if (hasReachedLimit) {
			toast.error(t`You've used all ${maxRounds} rounds for this text. Edit the content to get more AI suggestions.`);
			return;
		}

		console.log("Starting generation for round:", roundsUsed + 1);

		const toastId = toast.loading(
			roundsUsed === 0
				? t`Generating first suggestion...`
				: t`Generating refinement (Round ${roundsUsed + 1}/${maxRounds})...`,
		);

		generateContent(
			{
				provider,
				model,
				apiKey,
				baseURL,
				type,
				data: enhancedData,
			},
			{
				onSuccess: (content) => {
					console.log("Generation successful, content length:", content?.length);

					// Check if content is valid
					if (!content || content.length < 10) {
						toast.error(t`Generated content is too short. Please try again.`, { id: toastId });
						return;
					}

					toast.success(t`Content generated successfully!`, { id: toastId });
					onGenerated(content);

					// Record the round
					if (isMounted.current) {
						console.log("Recording round completion");
						onRoundComplete?.();
					}
				},
				onError: (error) => {
					console.error("Generation error:", error);
					toast.error(error.message || t`Failed to generate content`, { id: toastId });
				},
			},
		);
	};

	// Determine button text based on state
	const getButtonText = () => {
		if (isLoading) return "Generating...";

		if (hasReachedLimit) return "Ask Zoe (Used)";

		return `Ask Zoe (${roundsRemaining} ${roundsRemaining === 1 ? "round" : "rounds"} remaining)`;
	};

	const isDisabled = disabled || isLoading || !isWordCountValid || hasReachedLimit;
	return (
		<Button
			type="button"
			size="sm"
			variant="outline"
			onClick={handleGenerate}
			disabled={isDisabled}
			className={`flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 text-sm shadow-sm transition-all hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ${className || ""}`}
		>
			<img src="/src/dialogs/resume/zoe-talking.png" alt="" className="size-4" />
			<span>{getButtonText()}</span>
			{isLoading && (
				<span className="ml-1 h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
			)}
		</Button>
	);
}
