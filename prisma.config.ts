import path from "node:path";
import process from "node:process";
import { defineConfig, env } from "prisma/config";

try {
  process.loadEnvFile(path.join(__dirname, ".env.local"));
} catch {
  // .env.local not present (e.g. CI/Vercel build, where env vars are injected directly)
}

export default defineConfig({
  schema: path.join(__dirname, "prisma", "schema.prisma"),
  datasource: {
    url: env("DATABASE_URL"),
  },
});
