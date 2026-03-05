import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { CircleNotchIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useResizeObserver } from "usehooks-ts";
import type { RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { ResumeDropdownMenu } from "../menus/dropdown-menu";
import { BaseCard } from "./base-card";

type ResumeCardProps = {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume }: ResumeCardProps) {
	const { i18n } = useLingui();

	const containerRef = useRef<HTMLDivElement>(null);
	const { width: containerWidth = 0 } = useResizeObserver({
		ref: containerRef as React.RefObject<HTMLElement>,
	});

	const updatedAt = useMemo(() => {
		return Intl.DateTimeFormat(i18n.locale, { dateStyle: "long", timeStyle: "short" }).format(resume.updatedAt);
	}, [i18n.locale, resume.updatedAt]);

	const scale = useMemo(() => {
		if (containerWidth === 0) return 0;
		return containerWidth / 794;
	}, [containerWidth]);

	const [isIframeReady, setIsIframeReady] = useState(false);

	useEffect(() => {
		const handleMessage = (event: MessageEvent) => {
			if (event.data?.type === "RESUME_READY" && event.data?.resumeId === resume.id) {
				setIsIframeReady(true);
			}
		};

		window.addEventListener("message", handleMessage);
		return () => window.removeEventListener("message", handleMessage);
	}, [resume.id]);

	return (
		<div className="relative">
			<Link to="/builder/$resumeId" params={{ resumeId: resume.id }} className="cursor-default">
				<BaseCard title={resume.name} description={t`Last updated on ${updatedAt}`} tags={resume.tags}>
					<div ref={containerRef} className="relative size-full overflow-hidden bg-white">
						<AnimatePresence>
							{!isIframeReady && (
								<motion.div
									key="loader"
									initial={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="absolute inset-0 z-10 flex items-center justify-center bg-white"
								>
									<CircleNotchIcon weight="thin" className="size-12 animate-spin" />
								</motion.div>
							)}
						</AnimatePresence>

						<div
							className={cn(
								"absolute inset-0 flex items-start justify-center overflow-hidden transition-opacity duration-500",
								!isIframeReady && "opacity-0",
							)}
						>
							<div
								style={{
									width: "794px",
									height: "1123px",
									flexShrink: 0,
									transform: `scale(${scale || 0.3})`,
									transformOrigin: "top center",
									backgroundColor: "white",
								}}
							>
								<iframe
									scrolling="no"
									src={`/printer/${resume.id}?token=preview`}
									title={resume.name}
									loading="lazy"
									className="pointer-events-none size-full border-0"
									style={{
										backgroundColor: "white",
									}}
								/>
							</div>
						</div>
					</div>

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
