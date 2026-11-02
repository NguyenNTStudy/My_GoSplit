import { loadEnvConfig } from "@next/env";
import { defineConfig } from "prisma/config";

// Load the same .env* files as Next.js (secrets live in .env.local).
loadEnvConfig(process.cwd());

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need Neon's direct (unpooled) connection; the app uses the pooled DATABASE_URL.
    url: process.env.DIRECT_URL,
  },
});
