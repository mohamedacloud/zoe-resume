import { t } from "@lingui/macro";
import { Trans } from "@lingui/react";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { HouseSimple, ReadCvLogo, Wrench, UserCircle } from "@phosphor-icons/react";

import { CommandItem } from "@/components/ui/command";
import { useCommandPaletteStore } from "../store";
import { BaseCommandGroup } from "./base";

// Define missing icons
const HouseSimpleIcon = HouseSimple;
const ReadCvLogoIcon = ReadCvLogo;
const WrenchIcon = Wrench;
const UserCircleIcon = UserCircle;

export function NavigationCommandGroup() {
	const navigate = useNavigate();
	const { session } = useRouteContext({ strict: false });
	const reset = useCommandPaletteStore((state: { reset: () => void }) => state.reset);
	const pushPage = useCommandPaletteStore((state: { pushPage: (page: string) => void }) => state.pushPage);

	function onNavigate(path: string) {
		navigate({ to: path });
		reset();
	}

	return (
		<>
			<BaseCommandGroup heading={<Trans id="go-to" />}>
				<CommandItem keywords={[t`Home`]} value="navigation.home" onSelect={() => onNavigate("/")}>
					<HouseSimpleIcon />
					<Trans id="home" />
				</CommandItem>

				<CommandItem
					disabled={!session}
					keywords={[t`Resumes`]}
					value="navigation.resumes"
					onSelect={() => onNavigate("/dashboard/resumes")}
				>
					<ReadCvLogoIcon />
					<Trans id="resumes" />
				</CommandItem>

				<CommandItem
					disabled={!session}
					keywords={[t`Settings`]}
					value="navigation.settings"
					onSelect={() => pushPage("settings")}
				>
					<WrenchIcon />
					<Trans id="settings" />
				</CommandItem>
			</BaseCommandGroup>

			<BaseCommandGroup page="settings" heading={<Trans id="settings" />}>
				<CommandItem
					keywords={[t`Profile`]}
					value="navigation.settings.profile"
					onSelect={() => onNavigate("/dashboard/settings/profile")}
				>
					<UserCircleIcon />
					<Trans id="profile" />
				</CommandItem>
			</BaseCommandGroup>
		</>
	);
}
