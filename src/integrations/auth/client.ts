import { passkeyClient } from "@better-auth/passkey/client";
import {
	apiKeyClient,
	genericOAuthClient,
	inferAdditionalFields,
	twoFactorClient,
	usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./config";

const getAuthClient = () => {
	return createAuthClient({
		plugins: [
			apiKeyClient(),
			usernameClient(),
			twoFactorClient({
				onTwoFactorRedirect() {
					// 2FA UI removed; redirect users to resumes list instead
					if (typeof window !== "undefined") {
						window.location.href = "/dashboard/resumes";
					}
				},
			}),
			passkeyClient(),
			genericOAuthClient(),
			inferAdditionalFields<typeof auth>(),
		],
	});
};

export const authClient = getAuthClient();
