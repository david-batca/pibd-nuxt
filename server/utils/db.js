import { Pool } from "pg";

let pool = null;

export const getDb = () => {
  if (!pool) {
    const config = useRuntimeConfig();

    pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }

  return pool;
};
