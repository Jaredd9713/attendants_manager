const express = require("express");
const router = express.Router();
const attendantsManager = require("../services/attendantsManager");

router.get("/list-attendants", async (req, res, next) => {
  try {
    res.json(await attendantsManager.getList());
  } catch (err) {
    console.error("Error while getting attendants list");
    next(err);
  }
});

router.get("/get-user", async (req, res, next) => {
  try {
    res.json(await attendantsManager.getUser(req.body.id));
  } catch (err) {
    console.error("Error while getting searching user");
    next(err);
  }
});

router.get("/get-capacity", async (req, res, next) => {
  try {
    res.json(await attendantsManager.getCapacity(req.body.hall));
  } catch (err) {
    console.error("Error while getting hall capacity");
    next(err);
  }
});

router.put("/checkin", async (req, res, next) => {
  try {
    res.json(await attendantsManager.checkIn(req.body.id, req.body.hall));
  } catch (err) {
    console.error("Error while checking in");
    next(err);
  }
});

router.put("/checkout", async (req, res, next) => {
  try {
    res.json(await attendantsManager.checkOut(req.body.id));
  } catch (err) {
    console.error("Error while checking out");
    next(err);
  }
});

module.exports = router;