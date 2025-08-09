import { getDb } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const db = getDb();

  const sql = `
    SELECT * FROM songs;
  `;

  try {
    const { rows } = await db.query(sql);

    if (!rows.length) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Nu exista nicio melodie",
        })
      );
    }

    return rows;
  } catch (error) {
    return sendError(
      event,
      createError({
        statusCode: 500,
        statusMessage: error.message,
      })
    );
  }
});
