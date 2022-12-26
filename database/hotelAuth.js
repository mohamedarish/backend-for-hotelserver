const { getClient } = require(".");

const signUpNewHotel = async (req, res) => {
    const client = getClient();

    const { email, name, address, password } = req.body;

    if (!email || !name || !address || !password) return;

    try {
        const oldUser = await client.hotel.findFirst({
            where: {
                email,
            },
        });

        if (oldUser) {
            throw Error("User already exists");
        }

        const createdHotel = await client.hotel.create({
            data: {
                email,
                name,
                address,
                password,
            },
        });

        if (!createdHotel) {
            throw Error("Failed to create record");
        }

        res.status(200).json({
            email,
            name,
            userID: createdHotel.hotelID,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const checkHotelLoginCreds = async (req, res) => {
    const client = getClient();

    const { email, password } = req.body;

    if (!email || !password) return;

    try {
        const user = await client.hotel.findFirst({
            where: {
                email,
                password,
            },
        });

        if (!user) {
            throw Error("No user found");
        }

        res.status(200).json({
            email,
            name: user.name,
            userID: user.hotelID,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    signUpNewHotel,
    checkHotelLoginCreds,
};
