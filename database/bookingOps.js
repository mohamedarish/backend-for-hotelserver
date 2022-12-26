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
    } = req.body;

    if (
        !roomID ||
        !customerID ||
        !paymentDate ||
        !checkinDate ||
        !checkoutDate ||
        !amount
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
            },
        });

        if (!booking) {
            throw Error("Failed to create booking");
        }

        await client.room.update({
            where: {
                roomID,
            },
            data: {
                booked: true,
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

    const { userID, currentDate } = req.body;

    try {
        const bookings = await client.booking.findMany({
            where: {
                userID,
                some: {
                    checkoutDate: {
                        gt: currentDate,
                    },
                },
            },
            include: {
                bill: true,
                room: true,
            },
        });

        if (!bookings) {
            throw Error("No bookings found");
        }

        res.status(200).json({
            rooms: bookings,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const viewOldBookings = async (req, res) => {
    const client = getClient();

    const { userID, currentDate } = req.body;

    try {
        const bookings = await client.booking.findMany({
            where: {
                userID,
                some: {
                    checkoutDate: {
                        lt: currentDate,
                    },
                },
            },
            include: {
                bill: true,
                room: true,
            },
        });

        if (!bookings) {
            throw Error("No bookings found");
        }

        res.status(200).json({
            rooms: bookings,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    createBooking,
    viewCurrentBookings,
    viewOldBookings,
};

module.exports = {
    createBooking,
    viewCurrentBookings,
    viewOldBookings,
};
