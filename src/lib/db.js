import pg from 'pg';
const { Pool } = pg;

const connectionString = import.meta.env.VITE_DB_CONNECTION_STRING;

const pool = new Pool({ connectionString });

const db = {
	query: async (text, params) => {
		const client = await pool.connect();

		try {
			return client.query(text, params);
		} catch (err) {
			throw err;
		} finally {
			client.release();
		}
	}
};

export default db;
