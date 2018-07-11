beforeEach(() => {
    process.env.DB_HOST = "localhost";
    process.env.DB_USERNAME = "postgres";
    process.env.DB_PASSWORD = "postgres";
    process.env.DB_NAME = "usagedata";
    process.env.DB_PORT = "5432";
});