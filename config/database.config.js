import postgres from 'postgres'

// Server connections:
// LOCAL: Run on machine (PORT 5432)
// PRODUCTION: ...
let sql;
if (process.env.NODE_ENV === "development") {
	try {
		let startTime = performance.now();
		sql = postgres(process.env.DB_URI_DEVELOPMENT, {
			max: 10,
			connect_timeout: 35,
			connection: {
				application_name: 'lanceio_users_service'
			}
		})
		console.log(`Postgres connection established in ${(performance.now() - startTime).toPrecision(5)}ms`)
	}
	catch (err) {
		console.log(err);
	}
}

if (process.env.NODE_ENV === "production") {
	try {
		let startTime = performance.now();
		sql = postgres(process.env.DB_URI_PRODUCTION, {
			max: 10,
			connect_timeout: 35,
			connection: {
				application_name: 'lanceio_users_service'
			}
		})
		console.log(`Postgres connection established in ${performance.now() - startTime}ms`);
	}
	catch (err) {
		console.log(err);
	}
}


export default sql;


