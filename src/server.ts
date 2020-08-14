import express from "express"; // Para configurações na aplicação
import cors from "cors";
import routes from "./routes";

const app = express(); // Iniciando a aplicação

app.use(express.json()); // Fazendo com que a aplicação trabalhe com a formatação JSON
app.use(cors()); // Para que a A.P.I. seja acessível por outros domínios
app.use(routes);

app.listen(3333); // Conectando o servidor à porta 3333
