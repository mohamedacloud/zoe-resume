import * as dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../src/integrations/drizzle/schema";

dotenv.config();

async function listResumes() {
	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	const db = drizzle({ client: pool, schema });

	console.log("Listing resumes...");
	const resumes = await db.select().from(schema.resume);

	for (const resume of resumes) {
		console.log(`- ${resume.name} (ID: ${resume.id}) | Template: ${resume.data.metadata.template}`);
	}

	await pool.end();
}

listResumes().catch(console.error);
