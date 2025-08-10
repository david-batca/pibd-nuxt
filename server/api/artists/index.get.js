import { getDb } from "~~/server/utils/db";

export default defineEventHandler(async (event) => {
  const db = getDb();

  const sql = `
    SELECT 
      artists.id,
      artists.name,
      songs.id AS song_id,
      songs.name AS song_name
    FROM artists
    LEFT JOIN song_artists
      ON artists.id = song_artists.artist_id
    LEFT JOIN songs
      ON songs.id = song_artists.song_id
    ORDER BY artists.id;
  `;

  try {
    const { rows } = await db.query(sql);

    const result = new Map();
    for (const row of rows) {
      if (!result.has(row.id)) {
        result.set(row.id, { id: row.id, name: row.name, songs: [] });
      }

      if (row.song_id) {
        result.get(row.id).songs.push({ id: row.song_id, name: row.song_name });
      }
    }

    return Array.from(result.values());
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
