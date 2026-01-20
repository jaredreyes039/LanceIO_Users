import postgres from 'postgres'

// Server connections:
// LOCAL: Run on machine (PORT 5432)
// PRODUCTION: ...
let sql;
if (process.env.NODE_ENV === "development") {
	try {
		sql = postgres("postgres://cooper@127.0.0.1:5432/development_personal", {
			host: '127.0.0.1',            // Postgres ip address[s] or domain name[s]
			port: 5432,          // Postgres server port[s]
			database: 'development_personal',            // Name of database to connect to
			username: 'cooper',            // Username of database user
			max: 10,
			connect_timeout: 35,
			connection: {
				application_name: 'lance_io_users_service'
			}
		})
		console.log("Postgres listening on Port 5432")
	}
	catch (err) {
		console.log(err);
	}
}


export default sql;


