var sql = require("mssql");

exports.initSqlConnection  = (callback) => {

    var config = {
        user: 'ADMIN',
        password: '2dopamine2:3',
        server: 'localhost', 
        database: 'lanceio_users',
        trustServerCertificate: true
    };

    sql.connect(config, function (err) {
                console.log("Initiating SQL Connection...")
                if (err) console.log(err);

                callback()                

    });

}