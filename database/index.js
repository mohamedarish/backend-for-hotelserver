const { PrismaClient } = require("@prisma/client");

const client = new PrismaClient();

function getClient() {
    return client;
}

const connectToDataBase = () => client.$connect;

module.exports = {
    getClient,
    connectToDataBase,
};
