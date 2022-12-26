const { getClient } = require(".");

const createNewRoom = async (req, res) => {
    const client = getClient();

    const { description, price, type, hotelID, images } = req.body;

    if (!description || price < 0 || !type || !hotelID || images.length < 1)
        return;

    try {
        const newRoom = await client.room.create({
            data: {
                description,
                price,
                type,
                booked: false,
                hotelID,
            },
        });

        if (!newRoom) {
            throw Error("Failed to create record");
        }

        images.forEach(async (link) => {
            await client.images.create({
                data: {
                    link,
                    roomID: newRoom.roomID,
                    hotelID,
                },
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

    const { roomID } = req.body;

    try {
        await client.images.deleteMany({
            where: {
                roomID,
            },
        });

        await client.review.deleteMany({
            where: {
                roomID,
            },
        });

        await client.booking.deleteMany({
            where: {
                roomID,
            },
        });

        await client.room.delete({
            where: {
                roomID,
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

const allMyRooms = async (req, res) => {
    const client = getClient();

    const { hotelID } = req.body;

    try {
        const allRooms = await client.room.findMany({
            where: {
                hotelID,
            },
            include: {
                hotel: true,
            },
        });

        if (allRooms.length < 1) {
            throw Error("No rooms found");
        }

        const rooms = [];

        for (let i = 0; i < allRooms.length; i += 1) {
            const image = await client.images.findFirst({
                where: {
                    roomID: allRooms[i].roomID,
                },
            });

            const reviewNumber = await client.review.aggregate({
                _count: {
                    review: true,
                },
                where: {
                    roomID: allRooms[i].roomID,
                },
            });

            const avgReview = await client.review.aggregate({
                _avg: {
                    review: true,
                },
                where: {
                    roomID: allRooms[i].roomID,
                },
            });

            rooms.push({
                roomID: allRooms[i].roomID,
                description: allRooms[i].description,
                price: allRooms[i].price,
                booked: allRooms[i].booked,
                type: allRooms[i].type,
                hotelID: allRooms[i].hotelID,
                image: image
                    ? image.link
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
                name: allRooms[i].hotel.name,
                address: allRooms[i].hotel.address,
                number_of_reviews: reviewNumber._count.review,
                rating: Math.floor(avgReview._avg.review),
            });
        }

        res.status(200).json({
            rooms,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const getOneRoom = async (req, res) => {
    const client = getClient();

    const { roomID } = req.body;

    if (!roomID) return;

    try {
        const room = await client.images.findMany({
            where: {
                roomID,
            },
            include: {
                room: true,
                hotel: true,
            },
        });

        if (room.length < 1) {
            throw Error("Could Not retrive room");
        }

        let images = [];
        room.forEach((image) => {
            images.push(image.link);
        });

        const reviewNumber = await client.review.aggregate({
            _count: {
                review: true,
            },
            where: {
                roomID,
            },
        });

        const avgReview = await client.review.aggregate({
            _avg: {
                review: true,
            },
            where: {
                roomID,
            },
        });

        const roomData = {
            roomID: room[0].roomID,
            description: room[0].room.description,
            price: room[0].room.price,
            type: room[0].room.type,
            name: room[0].hotel.name,
            address: room[0].hotel.address,
            images,
            number_of_reviews: reviewNumber._count.review,
            rating: Math.floor(avgReview._avg.review),
        };

        res.status(200).json({
            room: roomData,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    createNewRoom,
    removeRoom,
    allMyRooms,
    getOneRoom,
};
