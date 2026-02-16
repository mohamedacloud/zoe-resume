import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { CircleNotchIcon, LockSimpleIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useRef } from "react";
import { useResizeObserver } from "usehooks-ts";
import { match, P } from "ts-pattern";
import { orpc, type RouterOutput } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { ResumeContextMenu } from "../menus/context-menu";
import { BaseCard } from "./base-card";

type ResumeCardProps = {
	resume: RouterOutput["resume"]["list"][number];
};

export function ResumeCard({ resume }: ResumeCardProps) {
	const { i18n } = useLingui();

	const { data: screenshotData, isLoading } = useQuery(
		orpc.printer.getResumeScreenshot.queryOptions({ input: { id: resume.id } }),
	);

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

	return (
		<ResumeContextMenu resume={resume}>
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
						.otherwise(() => {
							return (
								<div ref={containerRef} className="relative size-full overflow-hidden bg-white">
									<div className="absolute top-0 right-0 left-0 bottom-[104px] flex justify-center overflow-hidden">
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
												className="pointer-events-none size-full border-0"
												style={{
													backgroundColor: "white",
												}}
											/>
										</div>
									</div>
								</div>
							);
						})}

					<ResumeLockOverlay isLocked={resume.isLocked} />
				</BaseCard>
			</Link>
		</ResumeContextMenu>
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
