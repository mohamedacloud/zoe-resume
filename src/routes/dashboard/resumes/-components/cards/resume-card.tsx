import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { CircleNotchIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { match, P } from "ts-pattern";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { ResumeDropdownMenu } from "../menus/dropdown-menu";
import { BaseCard } from "./base-card";

type ResumeCardProps = {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume }: ResumeCardProps) {
	const { i18n } = useLingui();

	const { data: screenshotData, isLoading } = useQuery(
		orpc.printer.getResumeScreenshot.queryOptions({ input: { id: resume.id } }),
	);

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(resume.updatedAt);
	}, [i18n.locale, resume.updatedAt]);

	return (
		<div className="relative">
			<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="cursor-default">
				<BaseCard title={resume.name} description={t`Last updated on ${updatedAt}`} tags={resume.tags}>
					{match({ isLoading, imageSrc: screenshotData?.url })
						.with({ isLoading: true }, () => (
							<div className="flex size-full items-center justify-center">
								<CircleNotchIcon weight="thin" className="size-12 animate-spin" />
							</div>
						))
						.with({ imageSrc: P.string }, ({ imageSrc }) => (
							<img
								src={imageSrc}
								alt={resume.name}
								className={cn("size-full object-cover object-top transition-all", resume.isLocked && "blur-xs")}
							/>
						))
						.otherwise(() => (
							<div className="relative size-full overflow-hidden bg-white">
								<iframe
									src={`/printer/${resume.id}`}
									title={resume.name}
									className="pointer-events-none absolute top-0 left-1/2 h-[600%] w-[600%] origin-top -translate-x-1/2 scale-[0.167] border-0"
								/>
							</div>
						))}

					<ResumeLockOverlay isLocked={resume.isLocked} />
				</BaseCard>
			</Link>
			{/* 3-dots menu at top right */}
			<div className="absolute top-3 right-3 z-10">
				<ResumeDropdownMenu resume={resume}>
					<button
						className="flex items-center justify-center rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
						aria-label="Open menu"
						tabIndex={0}
					>
						<svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
							<circle cx="10" cy="4" r="1.5" />
							<circle cx="10" cy="10" r="1.5" />
							<circle cx="10" cy="16" r="1.5" />
						</svg>
					</button>
				</ResumeDropdownMenu>
			</div>
		</div>
	);
}

function ResumeLockOverlay({ isLocked }: { isLocked: boolean }) {
	return (
		<AnimatePresence>
			{isLocked && (
				<motion.div
					key="resume-lock-overlay"
					initial={{ opacity: 0 }}
					animate={{ opacity: 0.6 }}
					exit={{ opacity: 0 }}
					className="absolute inset-0 flex items-center justify-center"
				>
					<div className="flex items-center justify-center rounded-full bg-popover p-6">
						<LockSimpleIcon weight="thin" className="size-12 opacity-60" />
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
