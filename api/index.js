const express = require("express");
const cors = require("cors"); // Importa el paquete cors
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors()); // Habilita CORS para todas las solicitudes
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function startServer() {
  try {
    await client.connect();
    console.log("Conexión exitosa a MongoDB Atlas");

    const database = client.db("tax_status");
    const clients = database.collection("clients");

    app.locals.clients = clients;

    app.listen(port, () => {
      console.log(`Servidor de API escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas", error);
    process.exit(1);
  }
}

startServer();

// Ruta para registrar un nuevo cliente
app.post("/api/clients", async (req, res) => {
  const { codigo, estado } = req.body;
  const clients = req.app.locals.clients;

  try {
    const resultado = await clients.insertOne({ codigo, estado });
    res
      .status(201)
      .json({ mensaje: "Cliente registrado", id: resultado.insertedId });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar cliente" });
  }
});

// Ruta para consultar el estado de un cliente por su código
app.get("/api/clients/:codigo", async (req, res) => {
  const { codigo } = req.params;
  const clients = req.app.locals.clients;

  try {
    const cliente = await clients.findOne({ codigo });
    if (cliente) {
      res.json({ estado: cliente.estado });
    } else {
      res.status(404).json({ mensaje: "Código no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar el estado" });
  }
});
