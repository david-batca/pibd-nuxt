export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const db = getDb();

  try {
    const existsSql = `
      SELECT 1 FROM songs
      WHERE id = $1;
    `;

    const exists = await db.query(existsSql, [id]);

    if (!exists.rowCount) {
      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Aceasta melodie nu exista",
        })
      );
    }

    console.log(exists);
    const sql = `
      DELETE FROM songs
      WHERE id = $1
    `;

    await db.query(sql, [id]);

    return "Melodia a fost stearsa cu succes";
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
