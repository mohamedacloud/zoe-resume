import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { SortAscendingIcon, TagIcon } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { useEffect, useMemo } from "react";
import z from "zod";
import { Badge } from "@/components/ui/badge";
import { Combobox } from "@/components/ui/combobox";
import { MultipleCombobox } from "@/components/ui/multiple-combobox";
import { Separator } from "@/components/ui/separator";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/integrations/orpc/client";
import { cn } from "@/utils/style";
import { GridView } from "./-components/grid-view";

type SortOption = "lastUpdatedAt" | "createdAt" | "name";

const searchSchema = z.object({
	tags: z.array(z.string()).default([]),
	sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).default("lastUpdatedAt"),
});

export const Route = createFileRoute("/dashboard/resumes/")({
	component: RouteComponent,
	validateSearch: zodValidator(searchSchema),
	search: {
		middlewares: [stripSearchParams({ tags: [], sort: "lastUpdatedAt" })],
	},
});

function RouteComponent() {
	const { i18n } = useLingui();
	const { tags, sort } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { openDialog } = useDialogStore();

	const { data: allTags } = useQuery(orpc.resume.tags.list.queryOptions());
	const { data: resumes } = useQuery(orpc.resume.list.queryOptions({ input: { tags, sort } }));

	// Auto-open create resume dialog when user has no resumes (first time setup)
	useEffect(() => {
		if (resumes && resumes.length === 0) {
			openDialog("resume.create", undefined);
		}
	}, [resumes, openDialog]);

	const tagOptions = useMemo(() => {
		if (!allTags) return [];
		return allTags.map((tag) => ({ value: tag, label: tag }));
	}, [allTags]);

	const sortOptions = useMemo(() => {
		return [
			{ value: "lastUpdatedAt", label: i18n.t("Last Updated") },
			{ value: "createdAt", label: i18n.t("Created") },
			{ value: "name", label: i18n.t("Name") },
		];
	}, [i18n]);

	const lastUpdatedResume = useMemo(() => {
		if (!resumes || resumes.length === 0) return null;
		const sorted = [...resumes].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
		return sorted[0];
	}, [resumes]);

	const lastUpdateText = useMemo(() => {
		if (!lastUpdatedResume) return "Never";
		const now = new Date();
		const diff = now.getTime() - lastUpdatedResume.updatedAt.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);

		if (minutes < 1) return "Just now";
		if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		return `${days} day${days > 1 ? "s" : ""} ago`;
	}, [lastUpdatedResume]);

	return (
		<div className="space-y-6">
			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Total Resumes */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-3 flex items-start justify-between">
						<div>
							<p className="mb-2 text-gray-600 text-sm">
								<Trans>Total Resumes</Trans>
							</p>
							<p className="font-bold text-2xl text-emerald-600">{resumes?.length ?? 0}</p>
						</div>
						<div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
							<svg className="size-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Last Update */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-3 flex items-start justify-between">
						<div>
							<p className="mb-2 text-gray-600 text-sm">
								<Trans>Last Update</Trans>
							</p>
							<p className="font-semibold text-base text-emerald-600">{lastUpdateText}</p>
						</div>
						<div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
							<svg className="size-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Total Downloads */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-3 flex items-start justify-between">
						<div>
							<p className="mb-1 text-gray-600 text-sm">
								<Trans>Total Downloads</Trans>
							</p>
							<p className="mb-2 text-gray-500 text-xs">
								<Trans>This month</Trans>
							</p>
							<p className="font-bold text-2xl text-emerald-600">0</p>
						</div>
						<div className="flex size-10 items-center justify-center rounded-lg bg-emerald-50">
							<svg className="size-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
								/>
							</svg>
						</div>
					</div>
				</div>

				{/* Total Submissions */}
				<div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
					<div className="mb-3 flex items-start justify-between">
						<div>
							<p className="mb-2 text-gray-600 text-sm">
								<Trans>Total Submissions</Trans>
							</p>
							<p className="font-semibold text-amber-600 text-base">
								<Trans>Coming Soon!</Trans>
							</p>
						</div>
						<div className="flex size-10 items-center justify-center rounded-lg bg-gray-200">
							<svg className="size-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M4 6h16M4 10h16M4 14h16M4 18h16"
								/>
							</svg>
						</div>
					</div>
				</div>
			</div>

			<Separator />

			<div className="flex items-center gap-x-4">
				<Combobox
					value={sort}
					options={sortOptions}
					onValueChange={(value) => {
						if (!value) return;
						navigate({ search: { tags, sort: value as SortOption } });
					}}
					buttonProps={{
						title: t`Sort by`,
						variant: "ghost",
						children: (_, option) => (
							<>
								<SortAscendingIcon />
								{option?.label}
							</>
						),
					}}
				/>

				<MultipleCombobox
					value={tags}
					options={tagOptions}
					onValueChange={(value) => {
						navigate({ search: { tags: value, sort } });
					}}
					buttonProps={{
						variant: "ghost",
						title: t`Filter by`,
						className: cn({ hidden: tagOptions.length === 0 }),
						children: (_, options) => (
							<>
								<TagIcon />
								{options.map((option) => (
									<Badge key={option.value} variant="outline">
										{option.label}
									</Badge>
								))}
							</>
						),
					}}
				/>
			</div>

			<GridView resumes={resumes ?? []} />
		</div>
	);
}
