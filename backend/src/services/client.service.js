const Client = require("../models/client.model");

const getClientByUserId = async (userId) => {
    const client = await Client.findOne({ userId });
    if (!client) throw new Error("Client non trouvé");
    return client;
};

const getAddresses = async (userId) => {
    const client = await getClientByUserId(userId);
    return client.addresses;
};

const addAddress = async (userId, address) => {
    const client = await getClientByUserId(userId);
    client.addresses.push(address);
    await client.save();
    return client.addresses[client.addresses.length - 1]; // retourne la dernière ajoutée
};

module.exports = { getAddresses, addAddress, getClientByUserId };
