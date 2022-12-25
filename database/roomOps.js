const { getClient } = require(".");

const createNewRoom = async (req, res) => {
    const client = getClient();

    const { description, price, type, hotelNo, images } = req.body;

    if (!description || price < 0 || !type || !hotelNo) return;

    try {
        await client.room.create({
            data: {
                description,
                price,
                type,
                booked: false,
                hotelNo,
            },
        });

        images.forEach(async (link) => {
            await client.image.create({
                link,
                roomNo,
            });
        });

        res.status(200).json({
            report: true,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            report: false,
        });
    }
};

const removeRoom = async (req, res) => {
    const client = getClient();

    const { roomNo } = req.body;

    try {
        await client.images.delete({
            where: {
                roomNo,
            },
        });

        await client.room.delete({
            where: {
                roomNo,
            },
        });

        res.status(200).json({
            report: true,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
            report: false,
        });
    }
};

module.exports = {
    createNewRoom,
    removeRoom,
};
