const express = require("express");
const { signUpNewUser, checkUserLoginCreds } = require("../database/userAuth");
const {
    signUpNewHotel,
    checkHotelLoginCreds,
} = require("../database/hotelAuth");
const {
    createNewRoom,
    removeRoom,
    allMyRooms,
    getOneRoom,
} = require("../database/roomOps");
const {
    createBooking,
    viewCurrentBookings,
    viewOldBookings,
} = require("../database/bookingOps");
const { createReview, viewReviews } = require("../database/reviewOps");

const router = express.Router();

router.post("/register", signUpNewUser);

router.post("/login", checkUserLoginCreds);

router.post("/registerhotel", signUpNewHotel);

router.post("/loginhotel", checkHotelLoginCreds);

router.post("/addroom", createNewRoom);

router.post("/removeroom", removeRoom);

router.post("/myrooms", allMyRooms);

router.post("/oneroom", getOneRoom);

router.post("/bookroom", createBooking);

router.post("/currentbookings", viewCurrentBookings);

router.post("/oldbookings", viewOldBookings);

router.post("/createreview", createReview);

router.post("/viewreview", viewReviews);

module.exports = router;
