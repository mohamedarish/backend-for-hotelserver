const { getClient } = require(".");

const createBooking = async (req, res) => {
    const client = getClient();

    const {
        roomID,
        customerID,
        paymentDate,
        checkinDate,
        checkoutDate,
        amount,
        hotelID,
    } = req.body;

    if (
        !roomID ||
        !customerID ||
        !paymentDate ||
        !checkinDate ||
        !checkoutDate ||
        !amount ||
        !hotelID
    )
        return;

    try {
        const bill = await client.bill.create({
            data: {
                amount,
                paymentDate,
            },
        });

        if (!bill) {
            throw Error("Failed to create the bill");
        }

        const booking = await client.booking.create({
            data: {
                checkinDate,
                checkoutDate,
                billID: bill.billID,
                customerID,
                roomID,
                hotelID,
            },
        });

        if (!booking) {
            throw Error("Failed to create booking");
        }

        if (checkoutDate > paymentDate) {
            await client.room.update({
                where: {
                    roomID,
                },
                data: {
                    booked: true,
                },
            });
        }

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

const cancelBooking = async (req, res) => {
    const client = getClient();

    const { bookingID } = req.body;

    if (!bookingID) return;

    try {
        const prev = await client.booking.delete({
            where: {
                bookingID,
            },
        });

        await client.room.update({
            where: {
                roomID: prev.roomID,
            },
            data: {
                booked: false,
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

const viewCurrentBookings = async (req, res) => {
    const client = getClient();

    const { customerID, currentDate } = req.body;

    try {
        const bookings = await client.booking.findMany({
            where: {
                customerID,
                checkoutDate: {
                    gt: currentDate,
                },
            },
            include: {
                bill: true,
                room: true,
                hotel: true,
            },
        });

        if (!bookings) {
            throw Error("No bookings found");
        }

        const rooms = [];

        for (let i = 0; i < bookings.length; i += 1) {
            const image = await client.images.findFirst({
                where: {
                    roomID: bookings[i].room.roomID,
                },
            });

            const reviewNumber = await client.review.aggregate({
                _count: {
                    review: true,
                },
                where: {
                    roomID: bookings[i].roomID,
                },
            });

            const avgReview = await client.review.aggregate({
                _avg: {
                    review: true,
                },
                where: {
                    roomID: bookings[i].roomID,
                },
            });

            rooms.push({
                bookingID: bookings[i].bookingID,
                name: bookings[i].hotel.name,
                address: bookings[i].hotel.address,
                price: bookings[i].bill.amount,
                image: image
                    ? image.link
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
                type: bookings[i].room.type,
                number_of_reviews: reviewNumber._count.review,
                rating: Math.floor(avgReview._avg.review),
                hotelID: bookings[i].hotelID,
                checkinDate: bookings[i].checkinDate,
                checkoutDate: bookings[i].checkoutDate,
                roomID: bookings[i].roomID,
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

const viewOldBookings = async (req, res) => {
    const client = getClient();

    const { customerID, currentDate } = req.body;

    try {
        const bookings = await client.booking.findMany({
            where: {
                customerID,
                checkoutDate: {
                    lt: currentDate,
                },
            },
            include: {
                bill: true,
                room: true,
                hotel: true,
            },
        });

        if (!bookings) {
            throw Error("No bookings found");
        }

        const rooms = [];

        for (let i = 0; i < bookings.length; i += 1) {
            const image = await client.images.findFirst({
                where: {
                    roomID: bookings[i].room.roomID,
                },
            });

            const reviewNumber = await client.review.aggregate({
                _count: {
                    review: true,
                },
                where: {
                    roomID: bookings[i].roomID,
                },
            });

            const avgReview = await client.review.aggregate({
                _avg: {
                    review: true,
                },
                where: {
                    roomID: bookings[i].roomID,
                },
            });

            rooms.push({
                bookingID: bookings[i].bookingID,
                name: bookings[i].hotel.name,
                address: bookings[i].hotel.address,
                price: bookings[i].bill.amount,
                image: image
                    ? image.link
                    : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930",
                type: bookings[i].room.type,
                number_of_reviews: reviewNumber._count.review,
                rating: Math.floor(avgReview._avg.review),
                hotelID: bookings[i].hotelID,
                checkinDate: bookings[i].checkinDate,
                checkoutDate: bookings[i].checkoutDate,
                roomID: bookings[i].roomID,
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

module.exports = {
    createBooking,
    cancelBooking,
    viewCurrentBookings,
    viewOldBookings,
};
