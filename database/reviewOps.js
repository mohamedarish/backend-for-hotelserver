const { getClient } = require(".");

const createReview = async (req, res) => {
    const client = getClient();

    const { review, title, description, customerID, roomID } = req.body;

    if (!review || !title || !customerID || !roomID) return;

    if (!description) {
        description = "";
    }

    try {
        const reviewID = (
            await client.review.findFirst({
                where: {
                    customerID,
                    roomID,
                },
            })
        ).reviewID;

        console.log(reviewID);

        await client.review.upsert({
            where: {
                reviewID,
            },
            update: {
                review,
                title,
                description,
            },
            create: {
                review,
                title,
                description,
                customerID,
                roomID,
            },
        });

        res.status(200).json({
            report: true,
        });
    } catch (error) {
        console.error(error);
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
            console.error(error);
            res.status(400).json({
                error: error.message,
                report: false,
            });
        }
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
            include: {
                customer: true,
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
