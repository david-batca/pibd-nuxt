export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const db = getDb();

  try {
    const sql = `
      DELETE FROM artists
      WHERE id = $1
    `;

    await db.query(sql, [id]);

    return "Artistul a fost stears cu succes";
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
