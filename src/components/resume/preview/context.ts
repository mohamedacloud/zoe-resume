import { createContext } from "react";

export const ResumePageContext = createContext<{
	pageIndex: number;
	itemDistribution?: Record<string, string[][]>;
}>({ pageIndex: 0 });
