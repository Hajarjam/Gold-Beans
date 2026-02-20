const checkoutService = require("../services/checkout.service");
const clientService = require("../services/client.service");

const fakeCheckout = async (req, res, next) => {
    try {
        const userId = req.user?.id || req.user?._id || req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: missing/invalid token" });
        }

        const {
            items, // array depuis front
            address, // {street, city, zip, country, phone}
            cardType, // visa/mastercard
            cardNumber, // on va juste last4
        } = req.body;

        if (!address?.street || !address?.city || !address?.zip) {
            return res.status(400).json({ message: "Address required" });
        }

        // 1) enregistrer l’adresse dans le profil client (optionnel mais demandé)
        await clientService.addAddress(userId, {
            street: address.street,
            city: address.city,
            zip: address.zip,
            country: address.country || "Morocco",
        });

        // 2) créer commande "fake"
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
