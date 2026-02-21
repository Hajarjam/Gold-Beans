const checkoutService = require("../services/checkout.service");
const clientService = require("../services/client.service");

const fakeCheckout = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user?.userId;
    const userEmail = req.user?.email;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing/invalid token" });
    }

    const { items, address, cardType, cardNumber } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    const allowedTypes = ["coffee", "machine", "subscription"];
    const hasInvalidItem = items.some(
      (item) =>
        !item ||
        !allowedTypes.includes(item.productType) ||
        !item.productId ||
        Number(item.quantity || 0) <= 0
    );

    if (hasInvalidItem) {
      return res.status(400).json({ message: "Invalid items payload" });
    }

    if (!address?.street || !address?.city || !address?.zip) {
      return res.status(400).json({ message: "Address required" });
    }

    await clientService.addAddress(
      userId,
      {
        street: address.street,
        city: address.city,
        zip: address.zip,
        country: address.country || "Morocco",
      },
      userEmail
    );

    const last4 = String(cardNumber || "").replace(/\s+/g, "").slice(-4);

    const order = await checkoutService.createFakeOrder({
      userId,
      items,
      shippingAddress: {
        street: address.street,
        city: address.city,
        zip: address.zip,
        country: address.country || "Morocco",
        phone: address.phone || "",
      },
      payment: {
        method: "FAKE_CARD",
        status: "PAID_FAKE",
        last4: last4 || "",
        cardType: cardType || "",
      },
    });

    res.status(201).json({ message: "Order confirmed (fake payment)", data: order });
  } catch (err) {
    next(err);
  }
};

module.exports = { fakeCheckout };
