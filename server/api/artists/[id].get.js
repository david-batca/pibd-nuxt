import { getDb } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const db = getDb();

  const sql = `
    SELECT 
      artists.id,
      artists.name,
      song_artists.song_id
    FROM artists
    LEFT JOIN song_artists
      ON artists.id = song_artists.artist_id
    WHERE artists.id = $1
  `;

  try {
    const { rows } = await db.query(sql, [id]);

    const result = new Map();
    for (const row of rows) {
      if (!result.has(row.id)) {
        result.set(row.id, { id: Number(row.id), name: row.name, artists: [] });
      }

      if (row.song_id) {
        result.get(row.id).songs.push(Number(row.song_id));
      }
    }

    return Array.from(result.values())[0];
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
