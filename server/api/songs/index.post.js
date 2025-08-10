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

    const songSql = `
      INSERT INTO songs (name)
      VALUES ($1)
      RETURNING id;
    `;

    const songResponse = await client.query(songSql, [body.name]);
    const songId = songResponse.rows[0].id;

    if (body.artists.length) {
      const pivotSqlPlaceholders = body.artists
        .map((_, index) => `($1, $${index + 2})`)
        .join(", ");

      const pivotSql = `
        INSERT INTO song_artists (song_id, artist_id)
        VALUES ${pivotSqlPlaceholders}
      `;

      await client.query(pivotSql, [songId, ...body.artists]);
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
        id: Number(songId),
        name: body.name,
        artists: artists.map((artist) => ({
          ...artist,
          id: Number(artist.id),
        })),
      };
    }

    return {
      id: Number(songId),
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
