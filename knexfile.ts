import path from "path";

module.exports = {
  client: "sqlite3",
  connection: {
    // Caminho até chegao ao database.sqlite
    filename: path.resolve(__dirname, "src", "database", "database.sqlite"),
  },
  migrations: {
    // Diretório para arquivos de migrações
    directory: path.resolve(__dirname, "src", "database", "migrations"),
  },
  useNullAsDefault: true,
};
