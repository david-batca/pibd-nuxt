export default defineEventHandler(async (event) => {
  const db = getDb();

  const sql = `
    SELECT
      id, name
    FROM songs;
  `;

  try {
    const { rows: result } = await db.query(sql);

    return result.map((option) => ({ ...option, id: Number(option.id) }));
  } catch (error) {
    return sendError(
      event,
      createError({
        status: 500,
        statusMessage: error.message,
      })
    );
  }
});
