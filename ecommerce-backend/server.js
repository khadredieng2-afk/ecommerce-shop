const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Base de données fichier
const DB_FILE = "orders.json";

// Créer fichier si inexistant
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// Lire base
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}

// Écrire base
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 📦 ROUTE : recevoir commande
app.post("/order", (req, res) => {
  const orders = readDB();

  const newOrder = {
    id: Date.now(),
    ...req.body
  };

  orders.push(newOrder);
  writeDB(orders);

  console.log("📦 Commande enregistrée");

  res.json({
    message: "Commande reçue",
    order: newOrder
  });
});

// 📦 ROUTE : voir commandes (admin)
app.get("/orders", (req, res) => {
  const orders = readDB();
  res.json(orders);
});

// 🚀 PORT (IMPORTANT pour Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🚀 Backend running on port " + PORT);
});
