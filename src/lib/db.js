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
	},
	// accepts an array of queries to execute
	transaction: async (queries) => {
		const client = await pool.connect();

		try {
			// start transaction
			await client.query('BEGIN');

			// loop through queries array and execute queries
			queries.forEach(async (e) => {
				await client.query(e.query, e.params);
			});

			// commit transaction
			await client.query('COMMIT');
		} catch (err) {
			await client.query('ROLLBACK');
			throw err;
		} finally {
			client.release();
		}
	}
};

export default db;
