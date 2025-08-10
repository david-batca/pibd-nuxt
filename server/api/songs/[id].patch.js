export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  if (!body.name) {
    return sendError(
      event,
      createError({ status: 400, statusMessage: "Numele este obligatoriu" })
    );
  }

  const db = getDb();
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const existsSql = `
      SELECT 1 FROM songs WHERE id = $1;
    `;
    const exists = await client.query(existsSql, [id]);

    if (!exists.rowCount) {
      await client.query("ROLLBACK");

      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Melodia nu exista",
        })
      );
    }

    const updateSongSql = `
      UPDATE songs 
      SET name = $1 
      WHERE id = $2;
    `;

    await client.query(updateSongSql, [body.name, id]);

    const deleteFromPivotSql = `
      DELETE FROM song_artists 
      WHERE song_id = $1;
    `;

    await client.query(deleteFromPivotSql, [id]);

    if (body.artists.length) {
      const pivotPlaceholders = body.artists
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const updatePivotSql = `
        INSERT INTO song_artists (song_id, artist_id)
        VALUES ${pivotPlaceholders};
      `;

      await client.query(updatePivotSql, [id, ...body.artists]);
    }
    await client.query("COMMIT");

    if (body.artists.length) {
      const artistsSqlPlaceholders = body.artists
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const artistsSql = `
        SELECT
          id, name
        FROM artists
        WHERE id IN (${artistsSqlPlaceholders});
      `;

      const { rows: artists } = await client.query(artistsSql, [
        ...body.artists,
      ]);

      return {
        id: Number(id),
        name: body.name,
        artists: artists.map((artist) => ({
          ...artist,
          id: Number(artist.id),
        })),
      };
    }

    return {
      id: Number(id),
      name: body.name,
      artists: [],
    };
  } catch (error) {
    await client.query("ROLLBACK");

    return sendError(
      event,
      createError({ statusCode: 500, statusMessage: error.message })
    );
  } finally {
    client.release();
  }
});
