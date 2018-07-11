const DBMigrate = require("db-migrate");

const DBHelper = {};

DBHelper.dropDB = async () => {
    var dbmigrate = DBMigrate.getInstance(true);
    console.log("Dropping DB..");
    await dbmigrate.dropDatabase(process.env.DB_NAME);
    console.log("Done dropping DB..");
}

DBHelper.initDB = () => {
    var dbmigrate = DBMigrate.getInstance(true);

    return new Promise((fulfil, reject) => {
        console.log("Creating DB..");
        dbmigrate.createDatabase(process.env.DB_NAME, () => {
            console.log("Done creating DB");
            console.log("Starting DB Migrations..");
            dbmigrate.up((err) => {
                if (err) {
                    console.error("Failed running DB migrations. Reason:" + err);
                    reject(err);
                }

                console.log("Done running DB migrations.");
                fulfil({});
            });
        });
    });
}

module.exports = DBHelper;