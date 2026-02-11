import { ensureGuestUserExists } from "@/integrations/orpc/helpers/guest-user";

async function main() {
	console.log("Creating guest user...");
	
	try {
		const guestUser = await ensureGuestUserExists();
		console.log("✅ Guest user created successfully:", {
			id: guestUser.id,
			name: guestUser.name,
			email: guestUser.email,
			username: guestUser.username,
		});
	} catch (error) {
		console.error("❌ Failed to create guest user:", error);
		process.exit(1);
	}

	process.exit(0);
}

main();
