const { getClient } = require(".");

const signUpNewUser = async (req, res) => {
    const client = getClient();

    const { email, name, address, DOB, password } = req.body;

    if (!email || !name || !address || !DOB || !password) return;

    try {
        const oldUser = await client.customer.findFirst({
            where: {
                email,
            },
        });

        if (oldUser) {
            throw Error("User Already Exists");
        }

        await client.customer.create({
            data: {
                email,
                name,
                address,
                DOB,
                password,
            },
        });

        res.status(200).json({
            email,
            name,
            address,
            DOB,
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

const checkUserLoginCreds = async (req, res) => {
    const client = getClient();

    const { email, password } = req.body;

    if (!email || !password) return;

    try {
        const user = await client.customer.findFirst({
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
        });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    signUpNewUser,
    checkUserLoginCreds,
};
