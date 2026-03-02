import { t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { ReadCvLogoIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDropdownMenu } from "@/components/user/dropdown-menu";
import { getInitials } from "@/utils/string";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	// Removed auth redirect to allow public access to dashboard
	beforeLoad: async ({ context }) => {
		// No authentication required; return session if present
		return { session: context.session };
	},
});

function RouteComponent() {
	const { i18n } = useLingui();

	return (
		<div className="flex min-h-screen flex-col bg-gray-50">
			{/* Header */}
			<header className="border-gray-200 border-b bg-white shadow-sm">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
					{/* Left: Logo and Title */}
					<div className="flex items-center gap-2 sm:gap-3">
						<img
							src="/src/dialogs/resume/zoe-talking.png"
							alt="Zoe AI"
							className="h-8 w-6 rounded-full sm:h-10 sm:w-8"
						/>
						<h1 className="font-bold text-base text-gray-900 sm:text-lg md:text-xl">Zoe Resume Builder</h1>
					</div>

					{/* Center: Navigation */}
					<nav className="flex items-center gap-2">
						<Link
							to="/dashboard/resumes"
							activeProps={{ className: "bg-emerald-50 text-emerald-700" }}
							className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-gray-700 text-sm transition-all hover:bg-gray-100 sm:px-4"
						>
							<ReadCvLogoIcon className="size-5" />
							<span>{i18n._(t`Resumes`)}</span>
						</Link>
					</nav>

					{/* Right: User Menu */}
					<UserDropdownMenu>
						{({ session }) => (
							<button className="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-gray-100">
								<Avatar className="size-8">
									<AvatarImage src={session.user.image ?? undefined} />
									<AvatarFallback className="text-xs">{getInitials(session.user.name)}</AvatarFallback>
								</Avatar>
								<div className="hidden text-left md:block">
									<p className="font-medium text-sm">{session.user.name}</p>
									<p className="text-gray-500 text-xs">{session.user.email}</p>
								</div>
							</button>
						)}
					</UserDropdownMenu>
				</div>
			</header>

			{/* Main Content */}
			<main className="@container mx-auto w-full max-w-7xl flex-1 p-6">
				<Outlet />
			</main>
		</div>
	);
}
