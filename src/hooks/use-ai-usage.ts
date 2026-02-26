import { useState } from "react";

export function useAIUsage(maxRounds: number = 2) {
	const [roundsUsed, setRoundsUsed] = useState(0);

	const recordAIUsage = () => {
		setRoundsUsed((prev) => {
			if (prev >= maxRounds) return prev;
			return prev + 1;
		});
	};

	const resetRounds = () => {
		setRoundsUsed(0);
	};

	const roundsRemaining = maxRounds - roundsUsed;
	const hasReachedLimit = roundsUsed >= maxRounds;

	return {
		roundsUsed,
		roundsRemaining,
		hasReachedLimit,
		recordAIUsage,
		resetRounds,
	};
}