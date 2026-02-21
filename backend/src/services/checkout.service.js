//Il sert à créer une commande (Order) dans la base de données quand un client clique sur "Payer".

const Order = require("../models/order.model");

const calcSubtotal = (items) =>
  items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);

//Si le client n’a rien dans son panier → on bloque.
const createFakeOrder = async ({ userId, items, shippingAddress, payment }) => {
  if (!Array.isArray(items) || items.length === 0) throw new Error("Cart empty");

  const subtotal = calcSubtotal(items);
  const shipping = 0; // tu peux calculer plus tard
  const total = subtotal + shipping;

  const order = await Order.create({
    userId,
    items,
    subtotal,
    shipping,
    total,
    shippingAddress,
    payment,
    status: "CONFIRMED",
  });

  return order;
};

module.exports = { createFakeOrder };
