import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	HouseSimpleIcon,
	ReadCvLogoIcon,
	UserCircleIcon,
	WrenchIcon,
} from "@phosphor-icons/react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { CommandItem } from "@/components/ui/command";
import { useCommandPaletteStore } from "../store";
import { BaseCommandGroup } from "./base";

export function NavigationCommandGroup() {
	const navigate = useNavigate();
	const { session } = useRouteContext({ strict: false });
	const reset = useCommandPaletteStore((state) => state.reset);
	const pushPage = useCommandPaletteStore((state) => state.pushPage);

	function onNavigate(path: string) {
		navigate({ to: path });
		reset();
	}

	return (
<>
			<BaseCommandGroup heading={<Trans>Go to...</Trans>}>
				<CommandItem keywords={[t`Home`]} value="navigation.home" onSelect={() => onNavigate("/")}>
					<HouseSimpleIcon />
					<Trans>Home</Trans>
				</CommandItem>

				<CommandItem
					disabled={!session}
					keywords={[t`Resumes`]}
					value="navigation.resumes"
					onSelect={() => onNavigate("/dashboard/resumes")}
				>
					<ReadCvLogoIcon />
					<Trans>Resumes</Trans>
				</CommandItem>

				<CommandItem
					disabled={!session}
					keywords={[t`Settings`]}
					value="navigation.settings"
					onSelect={() => pushPage("settings")}
				>
					<WrenchIcon />
					<Trans>Settings</Trans>
				</CommandItem>
			</BaseCommandGroup>

			<BaseCommandGroup page="settings" heading={<Trans>Settings</Trans>}>
				<CommandItem
					keywords={[t`Profile`]}
					value="navigation.settings.profile"
					onSelect={() => onNavigate("/dashboard/settings/profile")}
				>
					<UserCircleIcon />
					<Trans>Profile</Trans>
				</CommandItem>
			</BaseCommandGroup>
		</>
	);
}
