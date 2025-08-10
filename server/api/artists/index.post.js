export default defineEventHandler(async (event) => {
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

    const artistSql = `
      INSERT INTO artists (name)
      VALUES ($1)
      RETURNING id;
    `;

    const artistResponse = await client.query(artistSql, [body.name]);
    const artistId = artistResponse.rows[0].id;

    if (body.songs.length) {
      const pivotSqlPlaceholders = body.songs
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const pivotSql = `
        INSERT INTO song_artists (artist_id, song_id)
        VALUES ${pivotSqlPlaceholders}
      `;

      await client.query(pivotSql, [artistId, ...body.songs]);
    }

    await client.query("COMMIT");

    if (body.songs.length) {
      const songsSqlPlaceholders = body.songs
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const songsSql = `
        SELECT
          id, name
        FROM songs
        WHERE id IN (${songsSqlPlaceholders});
        `;

      const { rows: songs } = await client.query(songsSql, [...body.songs]);

      return {
        id: artistId,
        name: body.name,
        songs: songs,
      };
    }

    return {
      id: artistId,
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
