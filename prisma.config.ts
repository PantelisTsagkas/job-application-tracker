import path from "node:path";
import process from "node:process";
import { defineConfig } from "prisma/config";

try {
  process.loadEnvFile(path.join(__dirname, ".env.local"));
} catch {
  // .env.local not present (e.g. CI/Vercel build, where env vars are injected
  // directly, or a fresh clone before setup). Fall back to process.env.
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  migrations: {
    path: path.join(__dirname, "prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Use process.env directly rather than Prisma's env() helper: env() throws
    // if the var is missing, which would break `prisma generate` (run on
    // postinstall) on a fresh clone. generate doesn't need a connection;
    // db push/migrate read this once .env.local exists.
    url: process.env.DATABASE_URL,
  },
});
