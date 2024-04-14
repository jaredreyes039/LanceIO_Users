const { initSqlConnection } = require("../config/database.config")
const mssql = require("mssql")
const { tokenVerificationWrapper } = require("../middleware/auth.middleware")

exports.getUserById = (req, res) => {
    const {user_id} = req.params

    tokenVerificationWrapper(req, res, ()=>{
        initSqlConnection(()=>{
            const request = new mssql.Request();
            request.query(
                `
                    SELECT * FROM users WHERE user_id = '${user_id}'
                `, (err, result)=>{
                    if(err) throw err;
                    console.log(result)
                    return res.status(200).send({result})
                }
            )
        })
    }, token)
}