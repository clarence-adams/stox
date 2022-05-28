import { Pool } from 'pg';
const connectionString = import.meta.env.VITE_DB_CONNECTION_STRING;

const pool = new Pool({ connectionString });

export default db = {
	query: (text, params, callback) => {
		return pool.query(text, params, callback);
	}
};
