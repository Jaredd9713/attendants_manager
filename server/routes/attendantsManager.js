const express = require("express");
const router = express.Router();
const attendantsManager = require("../services/attendantsManager");

router.get("/get-user-activity", async (req, res, next) => {
  try {
    res.json(await attendantsManager.getUserActvity(req.body.id));
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

router.post("/checkin", async (req, res, next) => {
  try {
    res.json(
      await attendantsManager.checkIn(req.body.id, req.body.name, req.body.hall)
    );
  } catch (err) {
    console.error("Error while checking in");
    next(err);
  }
});

router.post("/checkout", async (req, res, next) => {
  try {
    res.json(
      await attendantsManager.checkOut(
        req.body.id,
        req.body.name,
        req.body.hall
      )
    );
  } catch (err) {
    console.error("Error while checking out");
    next(err);
  }
});

router.post("/add-user", async (req, res, next) => {
  try {
    res.json(await attendantsManager.addUser(req.body.id, req.body.name));
  } catch (err) {
    console.error("Error while inserting user");
    next(err);
  }
});

module.exports = router;
