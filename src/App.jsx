import { useState } from "react";
import "./App.css";

const PRODUCTS = [
  {
    id: 1,
    name: "T-shirt Premium",
    price: 5000,
    image: "https://picsum.photos/300?1"
  },
  {
    id: 2,
    name: "Sneakers",
    price: 15000,
    image: "https://picsum.photos/300?2"
  },
  {
    id: 3,
    name: "Casquette",
    price: 3000,
    image: "https://picsum.photos/300?3"
  }
];

export default function App() {
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState("shop");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: ""
  });

  // Ajouter produit
  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        { ...product, qty: 1 }
      ]);
    }
  };

  // Supprimer produit
  const removeItem = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  // Total
  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  // Envoyer commande
  const handleOrder = async () => {
    const order = {
      client: form,
      items: cart,
      total,
      date: new Date().toISOString()
    };

    try {
      const res = await fetch(
        "http://192.168.8.20:3000/order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(order)
        }
      );

      await res.json();

      alert("Commande envoyée ✔");

      setCart([]);
      setStep("shop");

    } catch (error) {
      console.error(error);

      alert("Erreur d'envoi ❌");
    }
  };

  // PAGE CHECKOUT
  if (step === "checkout") {
    return (
      <div className="container">
        <h1>
          📦 Validation commande
        </h1>

        <input
          placeholder="Nom complet"
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Téléphone"
          onChange={(e) =>
            setForm({
              ...form,
              phone: e.target.value
            })
          }
        />

        <br />
        <br />

        <input
          placeholder="Adresse livraison"
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value
            })
          }
        />

        <br />
        <br />

        {/* 💳 WAVE */}
        <div
          style={{
            background: "#e6f7ff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            border:
              "2px solid #00BFFF"
          }}
        >
          <h2>💳 Paiement Wave</h2>

          <p>
            Envoyez le paiement au :
          </p>

          <h2
            style={{
              color: "#0077cc"
            }}
          >
            +221 78 114 75 58
          </h2>

          <p>
            Après paiement,
            cliquez sur :
          </p>

          <strong>
            Confirmer la commande
          </strong>
        </div>

        <h3>
          Total : {total} FCFA
        </h3>

        <button onClick={handleOrder}>
          Confirmer la commande
        </button>

        <br />
        <br />

        <button
          onClick={() =>
            setStep("shop")
          }
        >
          Retour boutique
        </button>
      </div>
    );
  }

  // PAGE SHOP
  return (
    <div className="container">
      <h1 className="title">
        🛍️ Ma Boutique Moderne
      </h1>

      <div className="products">
        {PRODUCTS.map((p) => (
          <div
            className="card"
            key={p.id}
          >
            <img
              src={p.image}
              alt={p.name}
            />

            <h3>{p.name}</h3>

            <p className="price">
              {p.price} FCFA
            </p>

            <button
              onClick={() =>
                addToCart(p)
              }
            >
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>

      <div className="cart">
        <h2>🛒 Panier</h2>

        {cart.length === 0 ? (
          <p>Panier vide</p>
        ) : (
          cart.map((item) => (
            <div key={item.id}>
              <p>
                ✔ {item.name} ×{" "}
                {item.qty} =
                {" "}
                {item.price *
                  item.qty}{" "}
                FCFA
              </p>

              <button
                onClick={() =>
                  removeItem(item.id)
                }
              >
                ❌ Supprimer
              </button>
            </div>
          ))
        )}

        <h3>
          Total : {total} FCFA
        </h3>

        {cart.length > 0 && (
          <button
            onClick={() =>
              setStep("checkout")
            }
          >
            Passer commande
          </button>
        )}
      </div>
    </div>
  );
}
