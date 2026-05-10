const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DB_FILE = "orders.json";

// créer fichier si inexistant
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, "[]");
}

// lire commandes
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

// sauvegarder commandes
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// 📦 POST commande
app.post("/order", (req, res) => {
  const orders = readDB();

  orders.push(req.body);

  saveDB(orders);

  console.log("📦 Commande enregistrée");

  res.json({
    success: true,
    message: "Commande sauvegardée ✔"
  });
});

// 📊 GET commandes
app.get("/orders", (req, res) => {
  res.json(readDB());
});

// 🚀 serveur
app.listen(3000, () => {
  console.log("🚀 Backend JSON prêt sur http://localhost:3000");
});
