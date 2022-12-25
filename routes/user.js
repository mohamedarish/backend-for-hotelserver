const express = require("express");
const { signUpNewUser, checkUserLoginCreds } = require("../database/userAuth");
const {
    signUpNewHotel,
    checkHotelLoginCreds,
} = require("../database/hotelAuth");

const router = express.Router();

router.post("/register", signUpNewUser);

router.post("/login", checkUserLoginCreds);

router.post("/registerhotel", signUpNewHotel);

router.post("/loginhotel", checkHotelLoginCreds);

module.exports = router;
