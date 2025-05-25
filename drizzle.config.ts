import * as dotenv from "dotenv"
import { defineConfig } from 'drizzle-kit';

dotenv.config({path : ".env.local"})
if (!process.env.DATABASE_URL) {
    throw new Error("Database url is not set in .env.local")
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  migrations : {
    table : "___drizzle_migrations",
    schema : "public"
  },
  verbose : true,
  strict : true,
});
