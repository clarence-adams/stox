import { Pool } from 'pg';
const connectionString = import.meta.env.VITE_DB_CONNECTION_STRING;

const pool = new Pool({ connectionString });

export default db = {
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
