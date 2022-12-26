const { getClient } = require(".");

const createReview = async (req, res) => {
    const client = getClient();

    const { review, title, description, customerID, roomID } = req.body;

    if (!review || !title || !customerID || !roomID) return;

    if (!description) {
        description = "";
    }

    try {
        await client.review.create({
            review,
            title,
            description,
            customerID,
            roomID,
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

const viewReviews = async (req, res) => {
    const client = getClient();

    const { roomID } = req.body;

    try {
        const reviews = await client.review.findMany({
            where: {
                roomID,
            },
        });

        res.status(200).json({
            reviews,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    createReview,
    viewReviews,
};
