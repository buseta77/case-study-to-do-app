const knexConfig = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./db.sqlite3"
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    useNullAsDefault: true,
  },
};

export default knexConfig;
