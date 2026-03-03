import { Trans } from "@lingui/react/macro";
import { CheckCircleIcon, LightbulbIcon, ShieldWarningIcon, WarningCircleIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { FinalReviewResult } from "@/components/resume/store/resume";
import { useResumeStore } from "@/components/resume/store/resume";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/utils/style";

type ReviewDrawerProps = {
	result: FinalReviewResult;
};

export function ReviewDrawer({ result }: ReviewDrawerProps) {
	const showDrawer = useResumeStore((state) => state.showReviewDrawer);
	const setShowDrawer = useResumeStore((state) => state.setShowReviewDrawer);
	const [showDetails, setShowDetails] = useState(false);

	const getStatusColor = () => {
		if (result.final_verdict === "READY") return "text-green-600 bg-green-50 border-green-200";
		if (result.final_verdict === "NEEDS_MINOR_FIXES") return "text-orange-600 bg-orange-50 border-orange-200";
		return "text-red-600 bg-red-50 border-red-200";
	};

	const getStatusText = () => {
		if (result.final_verdict === "READY") return "Ready to Export";
		if (result.final_verdict === "NEEDS_MINOR_FIXES") return "Needs Minor Fixes";
		return "Needs Major Work";
	};

	return (
		<AnimatePresence>
			{showDrawer && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-100 bg-black/20 backdrop-blur-sm"
						onClick={() => setShowDrawer(false)}
					/>

					{/* Drawer */}
					<motion.div
						initial={{ x: "100%" }}
						animate={{ x: 0 }}
						exit={{ x: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 200 }}
						className="fixed top-0 right-0 z-101 h-full w-full max-w-md border-l bg-background shadow-2xl sm:max-w-lg"
					>
						<div className="flex h-full flex-col">
							{/* Header */}
							<div className="flex items-center justify-between border-b p-4">
								<div className="flex-1">
									<h2 className="font-semibold text-xl">
										<Trans>Final Review</Trans>
									</h2>
									<p className="text-muted-foreground text-sm">
										<Trans>AI-powered resume analysis</Trans>
									</p>
								</div>
								<Button variant="ghost" size="icon" onClick={() => setShowDrawer(false)} aria-label="Close drawer">
									<XIcon className="h-5 w-5" />
								</Button>
							</div>

							{/* Content - Scrollable */}
							<div className="flex-1 overflow-y-auto p-4">
								<div className="space-y-4">
									{/* Score & Status */}
									<div className="space-y-3">
										<div className="flex items-center justify-between">
											<span className="font-medium text-sm">
												<Trans>Resume Score</Trans>
											</span>
											<span className="font-bold text-2xl">{result.overall_score}/100</span>
										</div>
										<Badge className={cn("w-full justify-center py-2 text-sm", getStatusColor())}>
											{getStatusText()}
										</Badge>
									</div>

									<Separator />

									{/* Critical Issues */}
									{result.critical.length > 0 && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<ShieldWarningIcon className="h-5 w-5 text-red-600" weight="fill" />
												<h3 className="font-semibold text-red-600 text-sm">
													<Trans>Critical Issues</Trans>
												</h3>
												<Badge variant="destructive" className="ml-auto">
													{result.critical.length}
												</Badge>
											</div>
											<div className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3">
												{result.critical.map((issue, index) => (
													<div key={index} className="flex items-start gap-2 text-red-900 text-sm">
														<span className="mt-0.5">•</span>
														<span className="flex-1">{issue}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Important Issues */}
									{result.important.length > 0 && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<WarningCircleIcon className="h-5 w-5 text-orange-600" weight="fill" />
												<h3 className="font-semibold text-orange-600 text-sm">
													<Trans>Important Issues</Trans>
												</h3>
												<Badge variant="outline" className="ml-auto border-orange-600 text-orange-600">
													{result.important.length}
												</Badge>
											</div>
											<div className="space-y-2 rounded-lg border border-orange-200 bg-orange-50 p-3">
												{result.important.map((issue, index) => (
													<div key={index} className="flex items-start gap-2 text-orange-900 text-sm">
														<span className="mt-0.5">•</span>
														<span className="flex-1">{issue}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Suggestions */}
									{result.suggestions.length > 0 && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<LightbulbIcon className="h-5 w-5 text-blue-600" weight="fill" />
												<h3 className="font-semibold text-blue-600 text-sm">
													<Trans>Suggestions</Trans>
												</h3>
												<Badge variant="outline" className="ml-auto border-blue-600 text-blue-600">
													{result.suggestions.length}
												</Badge>
											</div>
											<div className="space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
												{result.suggestions.map((suggestion, index) => (
													<div key={index} className="flex items-start gap-2 text-blue-900 text-sm">
														<span className="mt-0.5">•</span>
														<span className="flex-1">{suggestion}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Strengths */}
									{result.strengths.length > 0 && (
										<div className="space-y-2">
											<div className="flex items-center gap-2">
												<CheckCircleIcon className="h-5 w-5 text-green-600" weight="fill" />
												<h3 className="font-semibold text-green-600 text-sm">
													<Trans>Strengths</Trans>
												</h3>
												<Badge variant="outline" className="ml-auto border-green-600 text-green-600">
													{result.strengths.length}
												</Badge>
											</div>
											<div className="space-y-2 rounded-lg border border-green-200 bg-green-50 p-3">
												{result.strengths.map((strength, index) => (
													<div key={index} className="flex items-start gap-2 text-green-900 text-sm">
														<span className="mt-0.5">•</span>
														<span className="flex-1">{strength}</span>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Detailed Checks - Collapsible */}
									<div className="space-y-2">
										<Button
											variant="outline"
											size="sm"
											className="w-full justify-between"
											onClick={() => setShowDetails(!showDetails)}
										>
											<span className="font-medium text-sm">
												<Trans>Detailed Checks</Trans>
											</span>
											<motion.span animate={{ rotate: showDetails ? 180 : 0 }} transition={{ duration: 0.2 }}>
												▼
											</motion.span>
										</Button>

										<AnimatePresence>
											{showDetails && (
												<motion.div
													initial={{ height: 0, opacity: 0 }}
													animate={{ height: "auto", opacity: 1 }}
													exit={{ height: 0, opacity: 0 }}
													transition={{ duration: 0.2 }}
													className="overflow-hidden"
												>
													<div className="space-y-3 rounded-lg border bg-muted/30 p-3">
														<div>
															<span className="font-medium text-sm">
																<Trans>Photo Verdict</Trans>:
															</span>
															<p className="mt-1 text-muted-foreground text-sm">
																{result.detailed_checks.photo_verdict}
															</p>
														</div>
														<Separator />
														<div>
															<span className="font-medium text-sm">
																<Trans>Link Status</Trans>:
															</span>
															<p className="mt-1 text-muted-foreground text-sm">{result.detailed_checks.link_status}</p>
														</div>
														<Separator />
														<div>
															<span className="font-medium text-sm">
																<Trans>Grammar & Tense</Trans>:
															</span>
															<p className="mt-1 text-muted-foreground text-sm">
																{result.detailed_checks.grammar_tense}
															</p>
														</div>
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								</div>
							</div>

							{/* Footer */}
							<div className="border-t p-4">
								<Button onClick={() => setShowDrawer(false)} className="w-full">
									<Trans>Close Review</Trans>
								</Button>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
