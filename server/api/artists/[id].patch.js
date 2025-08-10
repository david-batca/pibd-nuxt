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
      SELECT 1 FROM artists WHERE id = $1;
    `;
    const exists = await client.query(existsSql, [id]);

    if (!exists.rowCount) {
      await client.query("ROLLBACK");

      return sendError(
        event,
        createError({
          statusCode: 404,
          statusMessage: "Artistul nu exista",
        })
      );
    }

    const updateArtistSql = `
      UPDATE songs 
      SET name = $1 
      WHERE id = $2;
    `;

    await client.query(updateArtistSql, [body.name, id]);

    const deleteFromPivotSql = `
      DELETE FROM song_artists 
      WHERE artist_id = $1;
    `;

    await client.query(deleteFromPivotSql, [id]);

    if (body.songs.length) {
      const pivotPlaceholders = body.songs
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const updatePivotSql = `
        INSERT INTO song_artists (artist_id, song_id)
        VALUES ${pivotPlaceholders};
      `;

      await client.query(updatePivotSql, [id, ...body.songs]);
    }
    await client.query("COMMIT");

    if (body.songs.length) {
      const songsSqlPlaceholders = body.songs
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const songsSql = `
        SELECT
          id, name
        FROM artists
        WHERE id IN (${songsSqlPlaceholders});
      `;

      const { rows: songs } = await client.query(songsSql, [...body.songs]);

      return {
        id: Number(id),
        name: body.name,
        songs: songs.map((song) => ({
          ...song,
          id: Number(song.id),
        })),
      };
    }

    return {
      id: Number(id),
      name: body.name,
      songs: [],
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
