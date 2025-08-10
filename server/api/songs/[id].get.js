import { getDb } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const db = getDb();

  const sql = `
    SELECT 
      songs.id,
      songs.name,
      song_artists.artist_id
    FROM songs
    LEFT JOIN song_artists
      ON songs.id = song_artists.song_id
    WHERE songs.id = $1
  `;

  try {
    const { rows } = await db.query(sql, [id]);

    const result = new Map();
    for (const row of rows) {
      if (!result.has(row.id)) {
        result.set(row.id, { id: Number(row.id), name: row.name, artists: [] });
      }

      if (row.artist_id) {
        result.get(row.id).artists.push(Number(row.artist_id));
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
